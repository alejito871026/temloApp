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
            <input type="text" class="form-control border border-warning m-4 col-md-5" id="input" placeholder="Cra 5norte # 29 cartago" v-model="direccion" @keyup="mostrarPosicion(coordenadas,direccion)">
            <div class="card-footer">
                <div class="btn btn-outline-warning btn-block" @click="gurdarUbicacionDestino()">
                    <h4>Guardar ubicacion de destino {{coord}}</h4>
                </div>
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
            direccion:'',
            coordenadas : {
                coords:{
                    latitude:0,
                    longitude:0
                }
            },
            coord:{
                lat:0,
                lng:0,
            }
        }
    },
    methods:{
        ...mapMutations('storeClientes',['estadoVerMapaCarrito']),
        async ingresarDestino(){
            await navigator.geolocation.getCurrentPosition(this.mostrarPosicion);
        },
        async mostrarPosicion(position,direccion){
            let lat = position.coords.latitude;
            let lng = position.coords.longitude
            this.coordenadas = {
                coords:{
                    latitude : lat,
                    longitude : lng
                },
            }
            this.coord = {
                lat,
                lng
            }
            this.mapStile={
                width: '0%',
                height: '0px'
            }
            this.loader.load().then(() => {               
                this.mapStile={
                    width: '100%',
                    height: '300px'
                }
                if(direccion){
                    if(direccion.length>=10){
                        const geoCoder = new google.maps.Geocoder()
                        geoCoder.geocode({'address':this.direccion,componentRestrictions: {country: "CO"}},(resultado, status)=>{
                            if (status === 'OK') {    
                                var resultados = resultado[0].geometry.location
                                let lat = resultados.lat()
                                let lng = resultados.lng()
                                this.coord = {
                                    lat,
                                    lng
                                }
                                let latLng = new google.maps.LatLng(lat, lng);
                                let map = new google.maps.Map(this.$refs.map, {
                                    center:latLng,
                                    zoom: 16,
                                    mapTypeId:'roadmap',
                                });
                                const infoWindow = new google.maps.InfoWindow({
                                    content: "Si no es esta tu ubicacion exacta, puedes dar click en la ubicacion exacta, o escribe la direccion en el buscador e intenta posicionar el marcador de geo-posicionamiento dando click en la ubicacion correcta.",
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
                                    console.log('124')
                                    // Close the current InfoWindow.
                                    infoWindow.close();
                                    map.setCenter(mapsMouseEvent.latLng)
                                    marker.setMap(null)
                                    let c = {
                                        lat : mapsMouseEvent.latLng.lat(),
                                        lng : mapsMouseEvent.latLng.lng()
                                    }
                                    this.coord = {
                                        lat:c.lat,
                                        lng:c.lng,
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
                        })
                    }else{
                        if(direccion==''|| direccion.length<3){
                            this.coord = {
                                lat,
                                lng
                            }
                            let latLng = new google.maps.LatLng(lat, lng);
                            let map = new google.maps.Map(this.$refs.map, {
                                center:latLng,
                                zoom: 16,
                                mapTypeId:'roadmap',
                            });
                            const infoWindow = new google.maps.InfoWindow({
                                content: "Si no es esta tu ubicacion exacta, puedes dar click en la ubicacion exacta, o escribe la direccion en el buscador e intenta posicionar el marcador de geo-posicionamiento dando click en la ubicacion correcta.",
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
                                console.log('174')
                                // Close the current InfoWindow.
                                infoWindow.close();
                                map.setCenter(mapsMouseEvent.latLng)
                                marker.setMap(null)
                                let c = {
                                    lat : mapsMouseEvent.latLng.lat(),
                                    lng : mapsMouseEvent.latLng.lng()
                                }
                                this.coord = {
                                    lat:c.lat,
                                    lng:c.lng,
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
                    }       
                }else{   
                    this.coord = {
                        lat,
                        lng
                    }            
                    let latLng = new google.maps.LatLng(lat, lng);
                    let map = new google.maps.Map(this.$refs.map, {
                        center:latLng,
                        zoom: 16,
                        mapTypeId:'roadmap',
                    });
                    const infoWindow = new google.maps.InfoWindow({
                        content: "Si no es esta tu ubicacion exacta, puedes dar click en la ubicacion exacta, o escribe la direccion en el buscador e intenta posicionar el marcador de geo-posicionamiento dando click en la ubicacion correcta.",
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
                        console.log('225')
                        let c = {
                            lat : mapsMouseEvent.latLng.lat(),
                            lng : mapsMouseEvent.latLng.lng()
                        }
                        this.coord = {
                            lat:c.lat,
                            lng:c.lng,
                        }
                        // Close the current InfoWindow.
                        infoWindow.close();
                        map.setCenter(mapsMouseEvent.latLng)
                        marker.setMap(null)
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
            this.modalDestino = true
        },
        gurdarUbicacionDestino(){
            this.coordenadasFinal = 0
            console.log(this.coord)
            //this.$auth.$storage.setUniversal('horaSalida',t)
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