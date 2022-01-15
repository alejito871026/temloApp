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
    {{$auth.$state.user}}   
    <div ref="map" id="map" :style="mapStile">
    </div>
    <div class="alert alert-danger input-group" v-if="!$auth.user.coordenadas && !viendoMapa">
      <h4><strong>Aun no has agregado las cordenadas. Actualiza la 
      informacion para poder hacer uso de las funcionalidades de la app &ensp; </strong></h4><div class="btn btn-primary" @click="validarCoordenadas()">Agregar coordenadas</div>
    </div>
    <div v-if="viendoMapa" class="p-3">
      <div class="alert alert-warning input-group" v-if="ayudas.segunda && valorBuscar.length>9">
        <div >
          <strong>Revisa el mapa, si el marcador </strong> <b-icon-geo-alt-fill variant="danger" font-scale="2"></b-icon-geo-alt-fill> no a sido posicionado en la direccion esperada, 
          escribe una direccion cercana, e intenta ubicar el marcador haciendo click en el mapa.
        </div>
      </div>
      <div v-if="ayudas.primera" class="row alert alert-info p-3">
        <div class="col md 8 text-center">
          Ingresa el nombre de la empresa o la direccion, seguido por el nombre de la ciudad. <br>
          <strong>Ejemplo ingresando el nombre:</strong> Temlo Dosquebradas Risaralda, <br>
          <strong>Ejemplo ingresando la direccion:</strong> Calle 9 # 1-74 Dosquebradas Risaralda. <br>
          <strong>
            El mapa te ira posicionando de acuerdo a la informacion. <br>
            Recuerda que puedes dar click en la ubicacion correcta para posicionar el marcador y establecer las coordenadas.
          </strong>
        </div>
        <div class="col-md-4 text-center p-2">
          <b-icon icon="arrow-down" animation="cylon-vertical" font-scale="3"></b-icon>
        </div>
      </div>
      <input type="text" class="form-control border border-primary" v-model="valorBuscar" @keyup="viendoDireccion()" v-if="!$auth.user.coordenadas"/>
      <div class="alert alert-warning mt-3" v-if="ayudas.segunda && valorBuscar.length>9">
         si el marcador <b-icon-geo-alt-fill variant="danger" font-scale="2"></b-icon-geo-alt-fill> esta en la ubicacion exacta, pesiona el boton Guardar para agregar estas coordenadas a la informacion de la empresa: <strong> {{$auth.user.empresa}}</strong>
        <div class="btn btn-primary" @click="guardarCoordenadas()">Guardar {{coordenadas}}</div>
      </div>
    </div>
    <div class="btn btn-success" @click="cerrarMapa()" v-if="viendoMapa">cerrar</div>
    <div v-if="moduloEmpleados">
        <barra-admin-proveedores/>
    </div>
    <div v-if="moduloCatalogo">
        <catalogo-proveedores/>
    </div>
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
      ayudas:{
        primera:false,
        segunda:false,
        tercera:false,
      },
      coordenadas:{
        lat:0,
        lng:0,
      }
    }
  },
    async mounted(){
      this.loader = new Loader({
          apiKey: 'AIzaSyBUug4MX79d36HIpp0O0lnESVzj4xI9LYM',
          version: "weekly",
          libraries: ["geometry","places"],
      });
      this.validandoLoguin()
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
        this.validarCoordenadas()       
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
              console.log(newToken)
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
          text:'Ingresa las coordenadas de la empresa, el sistema te guiara como hacerlo',
          icon: 'warning',
          showDenyButton: true,
          confirmButtonText: 'Cargar coordenadas',
          denyButtonText: 'No cargar',
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {  
            this.cargarMapaInicial()       
          } else if (result.isDenied) {
            this.$swal.fire('Changes are not saved', '', 'info')
          }
        })
      }
    },
    cargarMapaInicial(){     
      this.loader.load().then(() => {
        let lat = 4.7492485
        let lng = -75.9129166
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
      }
      this.viendoMapa = true
      this.ayudas.primera = true
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
        /* const card = document.getElementById("pac-card");
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(card); */
      });
      this.mapStile={
        width: '100%',
        height: '350px'
      }
      this.viendoMapa = true
    },
    async viendoDireccion(){
      if(this.valorBuscar.length>5){
        this.ayudas.segunda = true      
        const geoCoder = new google.maps.Geocoder()
        geoCoder.geocode({
          'address':this.valorBuscar,
          componentRestrictions: {
            country: "CO",
            //postalCode: "6600",
          }
        },(resultado, status)=>{
          if (status === 'OK') {
            var resultados = resultado[0].geometry.location
            let lat = resultados.lat()
            let lng = resultados.lng()
            this.coordenadas = {
              lat : resultados.lat(),
              lng : resultados.lng()
            }
            let latLng = new google.maps.LatLng(lat, lng);
            let map = new google.maps.Map(document.getElementById('map'), {
              center:latLng,
              zoom: 18,
              mapTypeId:'roadmap',
            });
            map.setCenter(resultado[0].geometry.location)
            const infoWindow = new google.maps.InfoWindow({
              content: "Si no es esta tu ubicacion, da click en la ubicacion correcta.",
            });
             var marker = new google.maps.Marker({                
              position: latLng, 
              map,
              title:'Ubicacion actual'
            });
            infoWindow.open({
              anchor: marker,
              map,
              shouldFocus: false,
            });   
            map.addListener("click", (mapsMouseEvent) => {
              // Close the current InfoWindow.
              infoWindow.close();
              console.log(mapsMouseEvent)
              map.setCenter(mapsMouseEvent.latLng)
              marker.setMap(null)
              this.coordenadas = {
                lat : mapsMouseEvent.latLng.lat(),
                lng : mapsMouseEvent.latLng.lng()
              }
              marker = new google.maps.Marker({                
                position: mapsMouseEvent.latLng, 
                map,
                title:'Ubicacion actual'
              });
              infoWindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
              });  
            })
          }
        });
      }
    },
    async guardarCoordenadas(){
      this.coordenadas._id = this.$auth.user.idEmpresa
      const coord  = await this.$axios.$post('/proveedores/guardarCoordenadas',this.coordenadas)
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