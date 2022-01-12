<template>
  <div v-if="$auth.loggedIn && $auth.user.rol=='SUPERADMIN' || $auth.loggedIn && $auth.user.rol=='ADMIN' ">
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-nav>
            <div class="nav-link btn" @click="dashboard()"><h5><strong>ADMIN - Dashboard</strong></h5></div>
        </b-navbar-nav>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <div class="nav-link btn" @click="verCatalogo()">Catalogo</div>
                <div class="nav-link btn" @click="verClientes()">Clientes</div>                
                <div class="nav-link btn" @click="verEmpleados()">Empleados</div>
                <div class="nav-link btn" @click="verProveedores()">Proveedores</div>                
                <div class="nav-link btn" @click="verTransportadores()">Transportadores</div>                
                <!-- <router-link to="/Admin/Catalogo" class="nav-link btn">Catalogo</router-link>
                <router-link to="/Admin/VentasTemlo" class="nav-link btn">Ventas</router-link> -->
                <b-navbar-nav @click="salir()" class="nav-link btn">Cerrar sesion</b-navbar-nav>  <!-- este se usa para cuando no es router link -->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    <div v-if="moduloEmpleados">
        <barra-ejecutivos-temlo/>
    </div>
    <div v-if="moduloCatalogo">
        <catalogo/>
    </div> 
    <div v-if="moduloProveedores">
        <proveedores/>
    </div>   
    <div v-if="moduloTransportadores">
        <transportadores-temlo/>
    </div> 
    <div v-if="moduloClientes">
        <clientes-temlo/>
    </div> 
     <div v-if="!moduloClientes && !moduloEmpleados && !moduloCatalogo && !moduloProveedores && !moduloTransportadores">
         <div class="row">
             <div class="col-md-6">
                 <h2 class="bd-primary p-2">Empleados temlo conectados {{conectadosTemlo.length}}</h2>
                 <div class="card" v-for="empleado in conectadosTemlo" :key="empleado.idEmpl">
                     <div class="card-body">{{empleado.nombre}} </div>
                 </div>
             </div>
             <div class="col-md-6">
                 <h2 class="bd-primary p-2">Empleados proveedores conectados {{conectadosProveedores.length}}</h2>
                 <div class="card" v-for="empleado in conectadosProveedores" :key="empleado.idEmpl">
                     <div class="card-body">{{empleado.nombre}} </div>
                 </div>
             </div>
             <div class="col-md-6">
                 <h2 class="bd-primary p-2">Transportadores conectados {{conectadosTransportadores.length}}</h2>
                 <div class="card" v-for="empleado in conectadosTransportadores" :key="empleado.idEmpl">
                     <div class="card-body">{{empleado.nombre}} </div>
                 </div>
             </div>
             <div class="col-md-6">
                 <h2 class="bd-primary p-2">Clientes conectados {{conectadosClientes.length}}</h2>
                 <div class="card" v-for="empleado in conectadosClientes" :key="empleado.idEmpl">
                     <div class="card-body">{{empleado.nombre}} </div>
                 </div>
             </div>
         </div>
        visitantes en la tienda {{visitantes}}
    </div> 

  </div>
</template>

<script>
import {mapActions} from 'vuex'
import barraEjecutivosTemlo from '../../components/adminTemlo/barraEjecutivosTemlo.vue'
import catalogo from '../../components/adminTemlo/catalogo.vue'
import proveedores from '../../components/adminTemlo/proveedores.vue'
import transportadoresTemlo from '../../components/adminTemlo/transportadoresTemlo.vue'
import clientesTemlo from '../../components/adminTemlo/clientesTemlo.vue'
export default {
    components : {
        barraEjecutivosTemlo,catalogo,proveedores,transportadoresTemlo,clientesTemlo
    },
    data(){
        return {
            moduloEmpleados : false,
            moduloCatalogo : false,
            moduloProveedores : false,
            moduloClientes : false,
            moduloTransportadores : false,
            conectadosTemlo : [],
            conectadosProveedores : [],
            conectadosTransportadores : [],
            conectadosClientes : [],
            visitantes:0,
            clientes:0
        }
    },
    async mounted(){ 
        this.validandoLoguin()
    },
    methods: {
        ...mapActions('storeCatalogo',['crearCategorias']),
        validandoLoguin(){
            if(!this.$auth.$state.loggedIn){
                console.log('no estas connectada')
                this.$router.push("/loguinUsers")
            }else{
                if(this.$auth.user.rol=='SUPERADMINPROVEEDOR'||this.$auth.user.rol=='ADMINPROVEEDOR'){
                    this.$router.push("/AdminProveedores")
                }else if(this.$auth.user.rol=='Ejecutivo'){
                    this.$router.push("/EjecutivoTemlo")
                }else if(this.$auth.user.rol=='Cliente'){
                    this.$router.push("/clientes")
                }else if(this.$auth.user.rol=='EjecutivoProveedor'){
                    this.$router.push("/EjecutivoProveedor")
                }else if(this.$auth.user.rol=='transportador'){
                    this.$router.push("/transportadores")
                } else {
                    this.socket = this.$nuxtSocket({
                        name: 'adminTemlo',
                        channel: '/adminTemlo',
                        persist: 'adminTemlo',
                    })
                    this.socket.emit('connected',{data:this.$auth.user,room:'adminTemlo'}) 
                    this.socket.on("conectadosTemlo",async()=>{
                        //debemos hacer una peticion para cargar la bd de econectados a temlo
                        this.conectadosTemlo = await this.cargaConectados(1)
                        this.conectadosProveedores = await this.cargaConectados(2)
                        this.conectadosTransportadores = this.cargaConectados(3)
                        this.conectadosClientes = await this.cargaConectados(4)
                    })
                    this.socket.on("conectadosProv",async()=>{
                        console.log('funcion')
                        this.conectadosProveedores = await this.cargaConectados(2)
                    }) 
                    this.socket.on("conectadostransp",async()=>{
                        this.conectadosTransportadores = this.cargaConectados(3)
                    }) 
                    this.socket.on("visitantes",()=>{
                        this.visitantes = this.visitantes+1
                    })
                    this.socket.on("salioVisitante",()=>{
                        if(this.visitantes>0){
                            this.visitantes = this.visitantes-1
                        }
                    })        
                    this.socket.on("clientes",async()=>{
                        this.clientes =+1
                        this.conectadosClientes = await this.cargaConectados(4)
                    })
                    this.socket.on("salioCliente", async ()=>{
                        this.clientes =-1
                        this.conectadosClientes = await this.cargaConectados(4)
                    })     
                    this.socket.on("eliminado",(data)=>{
                        console.log(data)
                    })            
                    this.crearCategorias()
                    if(this.$auth.$storage.getUniversal('horaSalidaAdminTemlo')){
                        this.cargarTemporizador(this.$auth.$storage.getUniversal('horaSalidaAdminTemlo'))
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
                    confirmButtonText: 'Actualizar token',
                    denyButtonText: `rechazar`,
                    }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {   
                        const newToken = await this.$axios.$post('/newLoginAdminTemlo/actualizarToken')
                        console.log(newToken)
                        if(newToken.success){
                            this.$auth.strategy.token.set(newToken.token)
                            this.$auth.strategy.token.sync()
                            let t = new Date()
                            t = t.setMinutes(t.getMinutes()+175)
                            this.$auth.$storage.setUniversal('horaSalidaAdminTemlo',t)
                            this.$swal.fire('se a actualizado la sesion!', '', 'success')
                            this.cargarTemporizador(this.$auth.$storage.getUniversal('horaSalidaAdminTemlo'))
                        }else{
                            this.$swal.fire('error en la actulizacion del token!', '', 'error')
                        }
                    } else if (result.isDenied) {
                        this.$swal.fire('pronto terminara tu sesion', '', 'info')
                    }
                })
            }, total);
        },
        async cargaConectados(n){
            let resp = {}
            if(n===1){
                resp = await this.$axios.$post('/conexion/cargarCliente1')
            }
            if(n===2){
                resp = await this.$axios.$post('/conexion/cargarCliente2')
            }
            if(n===3){
                resp = await this.$axios.$post('/conexion/cargarCliente3')
            }
            if(n===4){
                resp = await this.$axios.$post('/conexion/cargarCliente4')
            }
            return resp
        },
        verEmpleados(){
            this.moduloEmpleados = true;
            this.moduloCatalogo = false;
            this.moduloProveedores = false;
            this.moduloClientes = false
            this.moduloTransportadores = false
        },
        verCatalogo(){
            this.moduloEmpleados = false;
            this.moduloCatalogo = true;
            this.moduloProveedores = false;
            this.moduloClientes = false
            this.moduloTransportadores = false
        },
        verProveedores(){
            this.moduloEmpleados = false;
            this.moduloCatalogo = false;
            this.moduloProveedores = true;
            this.moduloClientes = false
            this.moduloTransportadores = false
        },
        verClientes(){
            this.moduloEmpleados = false;
            this.moduloCatalogo = false;
            this.moduloProveedores = false;
            this.moduloClientes = true
            this.moduloTransportadores = false
        },
        verTransportadores(){
            this.moduloEmpleados = false;
            this.moduloCatalogo = false;
            this.moduloProveedores = false;
            this.moduloClientes = false
            this.moduloTransportadores = true
        },
        dashboard(){
            this.moduloEmpleados = false;
            this.moduloCatalogo = false;
            this.moduloProveedores = false;
            this.moduloClientes = false
            this.moduloTransportadores = false
        },
        async salir() {
            const r = await this.socket.emit('salioCliente', this.$auth.user)
            if(r){
                this.$auth.$storage.removeUniversal('horaSalidaAdminTemlo')
                this.$router.push("/loguinUsers");
                this.$auth.logout()
            }
        },
    },
}
</script>

<style>

</style>