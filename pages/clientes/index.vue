<template>
  <div v-if="$auth.loggedIn && $auth.user.rol=='Cliente'">
        <barra-clientes/>
        <catalogo-clientes v-if="verCatalogoClientes"/>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
    computed:{
        ...mapState('storeClientes',['verCatalogoClientes'])
    },
    async mounted(){  
        this.validandoLoguin() 
    },
    methods:{
        ...mapMutations('storeClientes',['estadoVerCatalogoClientes','estadoActualizarProductoStock']),
        ...mapMutations('storeInicioSesion',['estadoAbrirInicioSesion']),
        validandoLoguin(){
            if(!this.$auth.$state.loggedIn){
                console.log('no estas connectada')
                this.estadoAbrirInicioSesion(true)
                window.onNuxtReady(() => { window.$nuxt.$router.push('/') })
            }else{
                if(this.$auth.user.rol=='SUPERADMIN'||this.$auth.user.rol=='ADMIN'){
                    this.$router.push("/adminTemlo")
                }else if(this.$auth.user.rol=='Ejecutivo'){
                    this.$router.push("/EjecutivoTemlo")
                }else if(this.$auth.user.rol=='SUPERADMINPROVEEDOR'||this.$auth.user.rol=='ADMINPROVEEDOR'){
                    this.$router.push("/AdminProveedores")
                }else if(this.$auth.user.rol=='EjecutivoProveedor'){
                    this.$router.push("/EjecutivoProveedor")
                }else if(this.$auth.user.rol=='transportador'){
                    this.$router.push("/transportadores")
                } else {
                    this.socket = this.$nuxtSocket({
                        name: 'temloApp.net',
                        channel: '/clientes',
                        persist: 'clientes',
                    })
                    this.socket.emit('clienteConectado',this.$auth.user)
                    this.socket.on('actualizarProducto',(data)=>{
                        this.estadoActualizarProductoStock({estado:true,data})
                    }) 
                    if(this.$auth.$storage.getUniversal('horaSalida')){
                        this.cargarTemporizador(this.$auth.$storage.getUniversal('horaSalida'))
                    }else{
                        console.log('no exsite la hora de salida')
                    }
                }              
            } 
        },
        cargarTemporizador(data){
            const hora = new Date(data)
            let h = hora.getHours()
            let m = hora.getMinutes()
            const HoraExacta = new Date()
            let hh = HoraExacta.getHours()
            let mm = HoraExacta.getMinutes() 
            let hf = 0
            let mf = 0
            if(hh>h){
                hh=24-hh
                hf=hh+h
                if(mm>m){
                    hf=hf-1
                }
            }else{
                hf = h-hh
                if(mm>m){
                    hf=hf-1
                }
            }
            if(mm>m){
                mm=60-mm
                mf=mm+m
            }else{
                mf=m-mm
            }
            console.log('faltan : '+ hf+':'+mf)
            const total = ((((hf * 60 )+ mf )* 60)*1000)
            setTimeout(()  => {
                this.$swal.fire({
                    icon:'info',
                    title: 'Ola '+ this.$auth.user.nombre+' si aun estas navegando deberas actualizar la sesion',
                    text: 'presiona ok para actualizar de lo contrario tu sesion expirara muy pronto!',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Actualizar token',
                    denyButtonText: `rechazar`,
                    }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {   
                        const newToken = await this.$axios.$post('/newLogin/actualizarToken')
                        console.log(newToken)
                        if(newToken.success){
                            this.$auth.strategy.token.set(newToken.token)
                            this.$auth.strategy.token.sync()
                            let t = new Date()
                            t = t.setMinutes(t.getMinutes()+175)
                            this.$auth.$storage.setUniversal('horaSalida',t)
                            this.$swal.fire('se a actualizado la sesion!', '', 'success')
                            this.cargarTemporizador(this.$auth.$storage.getUniversal('horaSalida'))
                        }else{
                            this.$swal.fire('error en la actulizacion del token!', '', 'error')
                        }
                    } else if (result.isDenied) {
                        this.$swal.fire('pronto terminara tu sesion', '', 'info')
                    }
                })
            }, total);
        },
    },
}
</script>

<style>

</style>