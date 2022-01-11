<template>
  <div v-if="$auth.loggedIn">
      {{$auth.user}}
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-nav>
            <router-link to="/Admin/Dashboard" class="nav-link text-white"><h5><strong>EJECUTIVOS - Dashboard</strong></h5></router-link>
        </b-navbar-nav>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <div class="nav-link btn" @click="verCatalogo()">Catalogo</div>
                <div class="nav-link btn" @click="verProveedores()">Proveedores</div> 
                <b-navbar-nav @click="salir()" class="nav-link btn">Cerrar sesion</b-navbar-nav>  <!-- este se usa para cuando no es router link -->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    <div v-if="moduloCatalogo">
        <catalogo/>
    </div> 
    <div v-if="moduloProveedores">
        <proveedores/>
    </div> 
    {{this.$auth.$state.user}}
  </div>
</template>

<script>
export default {
    data() {
        return {
            moduloCatalogo : false,  
            moduloProveedores : false, 
        }
    },
    mounted(){
        if(this.$auth.loggedIn){
            this.socket = this.$nuxtSocket({
                name: 'EjecutivoTemlo',
                channel: '/EjecutivoTemlo',
                persist: 'EjecutivoTemlo',
            })
            this.socket.emit('connected',{data:this.$auth.user,room:'ejecutivoTemlo'}) 
            /* this.socket.on("eliminado",(data)=>{
                console.log(data)
            }) */
        }else{
            this.$auth.logout()
            this.$router.push("/loguinUsers");
        }
    },
    methods: {
        verCatalogo(){
            this.moduloCatalogo = true;
            this.moduloProveedores = false;
        },
        verProveedores(){
            this.moduloCatalogo = false;
            this.moduloProveedores = true;
        },
        salir() {
            this.$router.push("/inicioSesion");
            this.$auth.logout()
        },
    },
}
</script>

<style>

</style>