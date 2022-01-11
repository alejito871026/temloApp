<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-nav>
                <router-link to="/EjecutivoProveedor" class="nav-link text-white"><h5><strong>EJECUTIVOS-PROVEEDORES - Dashboard</strong></h5></router-link>
            </b-navbar-nav>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <div class="nav-link btn" @click="verCatalogo()">Catalogo</div>   
                    <div class="nav-link btn" @click="verVentas()">Ventas</div>       
                    <b-navbar-nav @click="salir()" class="nav-link btn">Cerrar sesion</b-navbar-nav>  <!-- este se usa para cuando no es router link -->
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div v-if="moduloCatalogo">
            <catalogo-proveedores/>
        </div>
        {{this.$auth.$state.user}}
    </div>
</template>

<script>
export default {
    async mounted(){
        this.validandoLoguin()
    },
    data() {
        return {
            moduloCatalogo: false
        }
    },
    methods: {
        validandoLoguin(){
            if(!this.$auth.$state.loggedIn){
                console.log('no estas connectada')
            }else{
                if(this.$auth.user.rol=='SUPERADMIN'||this.$auth.user.rol=='ADMIN'){
                    this.$router.push("/adminTemlo")
                }else
                if(this.$auth.user.rol=='Ejecutivo'){
                    this.$router.push("/EjecutivoTemlo")
                }else
                if(this.$auth.user.rol=='SUPERADMINPROVEEDOR'||this.$auth.user.rol=='ADMINPROVEEDOR'){
                    this.$router.push("/AdminProveedores")
                }else
                if(this.$auth.user.rol=='Cliente'){
                    this.$router.push("/clientes")
                }else
                if(this.$auth.user.rol=='transportador'){
                    this.$router.push("/transportadores")
                }else 
                if(this.$auth.user.rol=='Cliente'){
                    this.$router.push("/clientes")
                } else {
                    this.socket = this.$nuxtSocket({
                        name: 'ejecutivoProveedor',
                        channel: '/ejecutivoProveedor',
                        persist: 'ejecutivoProveedor',
                    })
                    this.socket.emit('connected',{data:this.$auth.user,room:'ejecutivoProveedor'}) 
                }              
            } 
        },
        verCatalogo(){
            this.moduloCatalogo = true;
        },
        salir() {
            this.$router.push("/loguinUsers");
            this.$auth.logout()
        },
    },
}
</script>

<style>

</style>