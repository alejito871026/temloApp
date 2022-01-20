<template>
  <div class="mb-2">
      mapa
    <div class="btn btn-block btn-danger mt-2 " @click="estadoVerMapaCarrito(false)"><h5><strong>Cerrar mapa</strong></h5></div>
    <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="modalDestino">
        <div class="card">
            <div class="card-header bg-primary text-white text-center">
                <h4>Porfavor ubique en el mapa el lugar de destino</h4>
            </div>
            <div ref="map" id="map" :style="mapStile">

            </div>
            <div class="card-footer">
                <div class="btn btn-outline-warning btn-block" @click="cerrar()">
                    <h4>Cerrar ingreso de ubicacion</h4>
                </div>
            </div>
        </div>
    </b-modal>
  </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import {Loader} from '@googlemaps/js-api-loader';
export default {
    computed:{
        ...mapState('storeClientes',['verMapaCarrito']),
    },
    mounted(){
        this.loader = new Loader({
            apiKey: 'AIzaSyBUug4MX79d36HIpp0O0lnESVzj4xI9LYM',
            version: "weekly",
            libraries: ["geometry","places"],
        });
        this.ingresarDestino()
        //this.calcularDistancia()
    },
    data(){
        return {
            modalDestino : false,
             mapStile:{
                width: '0%',
                height: '0px'
            },
            map:null,
            loader:null,
        }
    },
    methods:{
        ...mapMutations('storeClientes',['estadoVerMapaCarrito']),
        ingresarDestino(){
            navigator.geolocation.getCurrentPosition(this.mostrarPosicion);
        },
        async mostrarPosicion(position){
            this.mapStile={
                width: '0%',
                height: '0px'
            }
            this.loader.load().then(() => {                
                let lat = position.coords.latitude;
                let lng = position.coords.longitude
                this.mapStile={
                    width: '100%',
                    height: '300px'
                }
                let latLng = new google.maps.LatLng(lat, lng);
                let map = new google.maps.Map(this.$refs.map, {
                    center:latLng,
                    zoom: 16,
                    mapTypeId:'roadmap',
                });
                const infoWindow = new google.maps.InfoWindow({
                    content: "Si no es esta tu ubicacion exacta, mueve el marcador de geo-posicionamiento dando click en la ubicacion correcta.",
                });
                let marker = new google.maps.Marker({
                    position: latLng,
                    map,
                });
                infoWindow.open({
                    anchor: marker,
                    map,
                    shouldFocus: false,
                });
                map.addListener("click", (mapsMouseEvent) => {
                    // Close the current InfoWindow.
                    infoWindow.close();
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
            }); 
            this.modalDestino = true
        },
        calcularDistancia(){

        },
        cerrar(){
            this.modalDestino = false,
            this.mapStile={
                width: '0px',
                height: '0px'
            }
            this.estadoVerMapaCarrito(false)
        },
    },

}
</script>

<style>
    #map {
        width: 100%;
        height: 100%;
    }
</style>