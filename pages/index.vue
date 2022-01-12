<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">  
      <div @click="verCatalogo=false, verPoliticas=false"  class="btn nav-link text-center text-white">TEMLO.NET</div>          
      <router-link to="/" id="creditos" class="nav-item text-white"></router-link>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto"> 
          <b-navbar-nav>
            <div @click="verPoliticas=true,verCatalogo=false, verTratamientoDatos=false"  class="btn nav-link text-center text-white">Politicas</div>
            <div @click="verCatalogo=true, verPoliticas=false"  class="btn nav-link text-center text-white">Catalogo</div>
            <div @click="estadoAbrirInicioSesion(true)"  class="btn nav-link text-center text-white">Inicio sesion</div>
            <div @click="estadoRegistroCliente(true)"  class="btn nav-link text-center text-white">Registrate</div>
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="col-md-12 bg-dark text-white justify-content-end">
    <div class="col-md-6 pb-2 mx-auto" v-if="verCatalogo">
        <b-form-input size="sm" class="mr-sm-2" placeholder="Buscar producto" @keyup="buscarProductoHome(productoHome)" v-model="productoHome"></b-form-input>
    </div>
    </div>
    <div v-if="verPoliticas">
      politicas
      <tratamientoDatos v-if="verTratamientoDatos"/>
    </div>
    <modal-inicio-sesion/>
    <modal-registro/>
    <catalogo-home v-if="verCatalogo"/>
    <pie-pagina/>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
  computed : {
    ...mapState('storeCatalogo',['productoHomeB']),
    ...mapState('storeInicioSesion',['abrirInicioSesion']),
  },
  data() {
        return {
            cantidad:0,
            productoHome:'',
            variable: new Boolean(),
            ocultar:true,
            verCatalogo:false,
            verPoliticas:false,
            verTratamientoDatos:false,
        }
    },
    watch:{
        productoHomeB:function(n,o){
            if(n==null){
                this.productoHome=n
            }
        },
    },
    async mounted() {
      console.log(this.$route.query)
      if(this.$route.query.id=='tratamientoDatos'){
        this.verPoliticas = true
        this.verTratamientoDatos = true
      }
      this.validandoLoguin()
    },
    methods: {
      ...mapActions('storeCatalogo',['buscarProductoHome']),
      ...mapMutations('storeInicioSesion',['estadoAbrirInicioSesion','estadoRegistroCliente','estadoIdSocket']),
      buscarProducto(data){
        this.buscarProductoHome(data)
      }, 
      validandoLoguin(){
        if(!this.$auth.$state.loggedIn){
          console.log('no estas connectada')
          this.socket = this.$nuxtSocket({
              name: 'temloApp.net',
              channel: '/',
              persist: 'registro',
              teardown: true
          }) 
          this.socket.emit('idSocket',this.socket.id,(respuesta)=>{
            this.estadoIdSocket(respuesta)
          })          
        }else{
          if(this.$auth.user.rol=='SUPERADMIN'||this.$auth.user.rol=='ADMIN'){
              this.$router.push("/adminTemlo")
          }
          if(this.$auth.user.rol=='Ejecutivo'){
              this.$router.push("/EjecutivoTemlo")
          }
          if(this.$auth.user.rol=='SUPERADMINPROVEEDOR'||this.$auth.user.rol=='ADMINPROVEEDOR'){
              this.$router.push("/AdminProveedores")
          }
          if(this.$auth.user.rol=='EjecutivoProveedor'){
              this.$router.push("/EjecutivoProveedor")
          }
          if(this.$auth.user.rol=='transportador'){
              this.$router.push("/transportadores")
          } 
          if(this.$auth.user.rol=='Cliente'){
              this.$router.push("/clientes")
          }               
        } 
      }  
    },
}
</script>
