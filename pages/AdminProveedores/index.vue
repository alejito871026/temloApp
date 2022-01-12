<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-nav>
            <router-link to="/AdminProveedores" class="nav-link text-white"><h5><strong>PROVEEDORES - Dashboard</strong></h5></router-link>
        </b-navbar-nav>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <div class="nav-link btn" v-if="$auth.user.coordenadas" @click="verMapa()">Mapa</div>
                <div class="nav-link btn" @click="verCatalogo()">Catalogo</div>
                <div class="nav-link btn" @click="verEmpleados()">Empleados</div>           
                <div class="nav-link btn" @click="verVentas()">Ventas</div>           
                <b-navbar-nav @click="salir()" class="nav-link btn">Cerrar sesion</b-navbar-nav>  <!-- este se usa para cuando no es router link -->
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    <div ref="map" id="map" :style="mapStile">
    </div>
    <input type="text" class="input-form" v-model="valorBuscar" @keyup="viendoDireccion()">
    <div class="btn btn-success" @click="cerrarMapa()" v-if="viendoMapa">cerrar</div>
    <div v-if="moduloEmpleados">
        <barra-admin-proveedores/>
    </div>
    <div v-if="moduloCatalogo">
        <catalogo-proveedores/>
    </div>
    {{this.$auth.$state.user}}
  </div>
</template>

<script>
      import {Loader} from '@googlemaps/js-api-loader';
export default {
  data(){
    return {
      moduloEmpleados:false,
      moduloCatalogo:false,
      mapa:'',
      viendoMapa:false,
      puntoVenta:{},
      map:null,
      mapStile:{
        width: '0%',
        height: '0px'
      },
      valorBuscar:'',
      loader:null,
    }
  },
    async mounted(){
      this.validarCoordenadas()
      this.validandoLoguin()
      this.loader = new Loader({
          apiKey: 'AIzaSyBUug4MX79d36HIpp0O0lnESVzj4xI9LYM',
          version: "weekly",
          libraries: ["geometry"],
      });
    },
  methods: {
    validandoLoguin(){
      if(!this.$auth.$state.loggedIn){
          console.log('no estas connectada')
          this.$router.push("/loguinUsers")
      }else{
        if(this.$auth.user.rol=='SUPERADMIN'||this.$auth.user.rol=='ADMIN'){
            this.$router.push("/adminTemlo")
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
            name: 'AdminProveedor',
            channel: '/AdminProveedor',
            persist: 'AdminProveedor',
          })
          this.socket.emit('connected',{data:this.$auth.user,room:'adminProveedor'})
        }      
        if(this.$auth.$storage.getUniversal('horaSalidaAdminProveedor')){
            this.cargarTemporizador(this.$auth.$storage.getUniversal('horaSalidaAdminProveedor'))
        }else{
            console.log('no exsite la hora de salida')
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
              const newToken = await this.$axios.$post('/newLoginProveedor/actualizarToken')
              if(newToken.success){
                  this.$auth.strategy.token.set(newToken.token)
                  this.$auth.strategy.token.sync()
                  let t = new Date()
                  t = t.setMinutes(t.getMinutes()+175)
                  this.$auth.$storage.setUniversal('horaSalidaAdminProveedor',t)
                  this.$swal.fire('se a actualizado la sesion!', '', 'success')
                  this.cargarTemporizador(this.$auth.$storage.getUniversal('horaSalidaAdminProveedor'))
              }else{
                  this.$swal.fire('error en la actulizacion del token!', '', 'error')
              }
          } else if (result.isDenied) {
              this.$swal.fire('pronto terminara tu sesion', '', 'info')
          }
        })
      }, total);
    },
    async validarCoordenadas(){
      if(!this.$auth.user.coordenadas){
        this.$swal.fire({
          title:'Porfavor',
          text:'Ingresa las coordenadas de la empresa',
          icon: 'warning',
          showDenyButton: true,
          confirmButtonText: 'Cargar coordenadas',
          denyButtonText: 'No cargar',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {            
            navigator.geolocation.watchPosition(this.cargarCoordenadass)          
          } else if (result.isDenied) {
            this.$swal.fire('Changes are not saved', '', 'info')
          }
        })
      }
    },
    cerrarMapa(){
      this.map = null
      this.viendoMapa=false
      this.mapStile={
        width: '0%',
        height: '0px'
      }
    },
    verMapa(){      
      this.loader.load().then(() => {
        let lat = this.$auth.user.coordenadas.latitude
        let lng = this.$auth.user.coordenadas.longitude 
        let latLng = new google.maps.LatLng(lat, lng);
        this.map = new google.maps.Map(this.$refs.map, {
          center:latLng,
          zoom: 17,
          mapTypeId:'roadmap',
        });
        new google.maps.Marker({
          position: latLng,
          map: this.map,
        });
        
      });
      this.mapStile={
        width: '100%',
        height: '350px'
      },
      this.viendoMapa = true
    },
    async viendoDireccion(){
      if(this.valorBuscar.length>3){
          const geoCoder = new google.maps.Geocoder()
          geoCoder.geocode({
            'address':this.valorBuscar},function (resultado, status){
            if (status === 'OK') {
              var resultados = resultado[0].geometry.location
              let lat = resultados.lat()
              let lng = resultados.lng()
              let latLng = new google.maps.LatLng(lat, lng);
              let map = new google.maps.Map(document.getElementById('map'), {
                center:latLng,
                zoom: 17,
                mapTypeId:'roadmap',
              });
              map.setCenter(resultado[0].geometry.location)
              new google.maps.Marker({                
                position: latLng, 
                map,
              });
            }
          });
        }
    },
    async cargarCoordenadass(position){
      let coordenadas = {
        latitude:0,
        longitude:0,
        _id:this.$auth.user.idEmpresa
      }
      coordenadas.latitude = position.coords.latitude,
      coordenadas.longitude = position.coords.longitude
      const coord  = await this.$axios.$post('/proveedores/guardarCoordenadas',coordenadas)
      console.log(coord)
      if(coord.success){
        this.$router.go(0)
        this.$swal.fire('Saved!', '', 'success')
      } 
    },
    verEmpleados(){
        this.moduloEmpleados = true;
         this.moduloCatalogo = false;
    },
    verCatalogo(){
          this.moduloEmpleados = false;
          this.moduloCatalogo = true;
      },
    async salir() {
      const r = await this.socket.emit('salioProveedor', this.$auth.user)
      if(r){
          this.$auth.$storage.removeUniversal('horaSalidaAdminProveedor')
          this.$router.push("/loguinUsers");
          this.$auth.logout()
      }
        this.$router.push("/loguinUsers");
        this.$auth.logout()
    },
  },

}
</script>

<style>
.GMap__Wrapper {
  width: 50%;
  height: 50%;
}

</style>