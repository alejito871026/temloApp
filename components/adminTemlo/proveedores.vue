<template>
  <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-toggle target="nav-collaps"></b-navbar-toggle>
        <b-collapse id="nav-collaps" is-nav>
            <b-navbar-nav class="ml-auto">
                <ul class="navbar-nav ">
                    <li class="btn text-white border border-primary sm"
                        @click="nuevoProveedor()">Nuevo proveedor
                    </li>
                </ul>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="nuevoP">
      <div class="card">
        <div class="card-title text-center m-3 p-3 rounded bg-primary text-white"><h3>Agregar nuevo proveedor</h3></div>
        <div class="card-body p-4">
            <form method="post" @submit.prevent="guardarProveedor()">
              <b-form-group
                  label="Razon social:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-form-input v-model="proveedor.razonSocialProveedor" type="text"></b-form-input>
              </b-form-group>
              <b-form-group
                  label="Nombre empresa:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-form-input v-model="proveedor.nombreProveedor" type="text"></b-form-input>
              </b-form-group>
              <b-form-group
                  label="Nit:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-form-input v-model="proveedor.nitProveedor" type="text"></b-form-input>
              </b-form-group>               
              <b-form-group
                  label="Telefono:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-input-group>
                      <b-form-input  v-model="celularP[0]" type="number"></b-form-input>
                      <b-input-group-append>
                          <div class="btn btn-warning"  @click="telefonos++"><b-icon-plus></b-icon-plus></div>
                      </b-input-group-append>
                  </b-input-group>          
                  <div v-for="telefono,index in telefonos" :key="telefono">
                      <br>
                      <b-input-group>
                          <b-form-input v-model="celularP[index+1]" type="number"></b-form-input>
                          <b-input-group-append>
                              <div class="btn btn-primary" @click="menosTelefonos(index+1)"><b-icon-dash></b-icon-dash></div>
                          </b-input-group-append>
                      </b-input-group>
                  </div>
              </b-form-group>
              <b-form-group
                  label="Direccion:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-form-input v-model="proveedor.direccionProveedor" type="text"></b-form-input>
              </b-form-group>
              <b-form-group
                  label="Rut:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-form-input v-model="proveedor.rutProveedor" type="text"></b-form-input>
              </b-form-group>
              <b-form-group
                  label="Email:"
                  label-cols-sm="2"
                  label-class="font-weight-bold pt-2"
                  label-align-sm="right">
                  <b-form-input v-model="proveedor.emailProveedor" type="text"></b-form-input>
              </b-form-group>
              <div>
                  <h2 class="card-title text-center p-3 rounded bg-primary text-white">Info super administrador</h2>
                  <div>
                    <b-form-group
                        label="Nombre:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-input-group>
                            <b-form-input  v-model="ssuper.nombreEP" type="text"></b-form-input>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group
                        label="1 Apellido:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-input-group>
                            <b-form-input  v-model="ssuper.primerApellidoEP" type="text"></b-form-input>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group
                        label="2 Apellido:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-input-group>
                            <b-form-input  v-model="ssuper.segundoApellidoEP" type="text"></b-form-input>
                        </b-input-group>
                    </b-form-group>
                    <b-form-group
                        label="Celular:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-form-input v-model="ssuper.celularEP" type="text"></b-form-input>
                    </b-form-group><b-form-group
                        label="Direccion:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-form-input v-model="ssuper.direccionEP" type="text"></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Cedula:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-form-input v-model="ssuper.cedulaEP" type="text"></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Fecha nacimiento:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-form-input v-model="ssuper.fechaNacEP" type="date"></b-form-input>
                    </b-form-group>
                    <b-form-group
                        label="Email:"
                        label-cols-sm="2"
                        label-class="font-weight-bold pt-2"
                        label-align-sm="right">
                        <b-form-input v-model="ssuper.emailEP"></b-form-input>
                    </b-form-group>
                  </div> 
              </div>
              <button class="btn btn-outline-success btn-block p-2"><h4>Guardar</h4></button>
            </form> 
            <div class="btn btn-block btn-outline-warning p-2 mt-2" @click="cerrarNuevoProveedor()"><h4>Cerrar nuevo proveedor</h4></div>
        </div>
      </div>
    </b-modal>
    <div class="p-2" v-if="!verProveedor">
      <table class="table table-hover table-sm">
        <thead>
          <tr>
            <th>Razon social</th>
            <th>nombre</th>
            <th>Nit</th>
            <th>Direccion</th>
            <th>Coordenadas</th>
            <th>Rut</th>
            <th>Email</th>
            <th>Telefonos</th>
            <th>Fecha agregado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proveedor in proveedores" :key="proveedor._id" @click="verProveedorr(proveedor)">
            <td>{{proveedor.razonSocialProveedor}}</td>
            <td>{{proveedor.nombreProveedor}}</td>
            <td>{{proveedor.nitProveedor}}</td>
            <td>{{proveedor.direccionProveedor}}</td>
            <td ><div v-if="proveedor.coordenadas">{{proveedor.coordenadas}}</div><div v-else>No</div></td>
            <td>{{proveedor.rutProveedor}}</td>
            <td>{{proveedor.emailProveedor}}</td>
            <td><div v-for="telefonos in proveedor.telefonoProveedor" :key="telefonos">{{telefonos}}</div></td>
            <td>{{proveedor.fechaAgregadoProveedor}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <component-ver-proveedor :empresa="empresa" v-if="verProveedor"/>
  </div>
</template>

<script>
import componentVerProveedor from '../../components/adminTemlo/componentesProveedoresTemlo/verProveedor.vue'
import {mapState,mapMutations} from 'vuex'
export default {
  components : {
    componentVerProveedor,
  },
    async mounted(){
      this.validandoLoguin()
    },
    computed:{
      ...mapState('storeAdminTemlo',['verProveedor'])
    },
    data() {
        return {
          nuevoP: false,
          proveedor:{
              razonSocialProveedor:'',
              nombreProveedor:'',
              nitProveedor:'',
              direccionProveedor:'',
              rutProveedor:'',
              emailProveedor:'',
              telefonoProveedor:'',
              fechaAgregadoProveedor:'',
          },
          ssuper:{},
          proveedores:[],
          sucursaleP:[],      
          celularP:[],
          telefonos:0,
          empresa:{},
        }
    },
  methods: {
    ...mapMutations('storeAdminTemlo',['estadoVerProveedor']),
    async validandoLoguin(){
      if(!this.$auth.loggedIn){
        const r = await this.$store.dispatch('$nuxtSocket/emit', {
          label: 'adminTemlo',
          evt: 'salioCliente',
          msg: this.$auth.user
        })
        console.log(r)
        console.log('222 proveedores.vue en componentes de admintemlo')
        if(r){
          this.$auth.$storage.removeUniversal('horaSalidaAdminTemlo')
          this.$auth.logout()
          this.$router.push("/loguinUsers");
        }            
      }else{
        this.verProveedores()
        console.log('esta logueado 196 proveedores.vue')
      }
    },
    async verProveedores(){
      this.proveedores = await this.$axios.$get('/proveedores/proveedores')
    },
    verProveedorr(proveedor){
      console.log(proveedor)
      this.estadoVerProveedor(true)
      this.empresa = proveedor
    },
    nuevoProveedor() {
      this.nuevoP = true
    },
    cerrarNuevoProveedor() {
      this.nuevoP = false
    },
    async guardarProveedor(){
      let proveedor = this.proveedor
      proveedor.telefonoProveedor = this.celularP 
      proveedor.fechaAgregadoProveedor = new Date()
      let b = 0
      for (const [key, value] of Object.entries(proveedor)) {
        if(value == ''){
          console.log('Hay un campo vacio: '+key)
          b = 1
          return
        } 
      }
      for (const [key, value] of Object.entries(this.ssuper)) {
        if(value == ''){
          console.log('Hay un campo vacio: '+key)
          b = 1
          return
        } 
      }
      if(b===0){
        console.log(proveedor)
        proveedor.super = this.ssuper
        proveedor.super.fechaAgregadoEP = new Date()
        proveedor.super.rol = 'SUPERADMINPROVEEDOR'
        const proveedorOk = await this.$axios.$post('/proveedores/guardarProveedor',proveedor)
        console.log(proveedorOk)
        if(proveedorOk.success) {
          this.cerrarNuevoProveedor() 
          this.verProveedores()
        }
      }      
    },
    menosTelefonos(index){
      this.celularP.splice(index,1)
      this.telefonos -- 
    },
  },
}
</script>

<style>

</style>