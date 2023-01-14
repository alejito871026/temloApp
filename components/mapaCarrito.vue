<template>
  <div class="mb-2">
      mapa
      <div ref="mapp" id="mapp" :style="mapStile"></div>
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
        async gurdarUbicacionDestino(){
            await this.$auth.$storage.removeUniversal('destino')
            this.$swal.fire({
                icon:'info',
                title: 'Procederemos a calcular la mejor ruta',
                text: 'Y la distancia que se debe recorrer!',
                showDenyButton: true,
                confirmButtonText: 'Calcular',
                denyButtonText: `Rechazar`,
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {  
                    await this.$auth.$storage.setUniversal('destino',this.coord) 
                    this.calcularDistancia()
                } else if (result.isDenied) {
                    this.cerrar()
                    this.$swal.fire('Puedes definir la ruta en el mapa cuando lo decees', 'vuelve pronto', 'info')
                }
            })            
        },
        async calcularDistancia(){
            this.cerrar()
            const productos=this.$auth.$storage.getUniversal('carrito')
            let prod = []
            for (let a = 0; a < productos.length; a++) {
                for (let b = 0; b < productos[a].proveedores.length; b++) {
                    let coord = await prod.findIndex(el => el.id === productos[a].proveedores[b].idProveedor) 
                    console.log(coord)
                    if(coord<0){
                        let proveedoresCoordenadas = {
                            id : productos[a].proveedores[b].idProveedor,
                            coordenadas : productos[a].proveedores[b].coordenadas
                        }
                        prod.push(proveedoresCoordenadas)
                    }
                }
                if(a==productos.length-1){
                    this.calcularDistanciados(prod)
                }
            }            
        },
        async calcularDistanciados(prod){
            const destino=this.$auth.$storage.getUniversal('destino')
            console.log(prod)
            console.log(destino)
            let coordenadasProveedores = []
            for (let c = 0; c < prod.length; c++) {  
                var coorden = null              
                //pasamos las coordenadas a un array de coordenadas tipo google latLan
                coorden = new google.maps.LatLng(prod[c].coordenadas.latitude,prod[c].coordenadas.longitude)
                coordenadasProveedores.push(coorden)            
            }
            //aca hacemos la peticion de distancia por cada uno de los lugares a visitar,
            //luego podemos definir de acuerdo a las distancias cula seria el primer lugar al ultimo antes de llegar al 
            //lugar de destino
            //const resp = await this.$axios.$post('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+destino.lat+'%2C'+destino.lng+'&destinations='+prod[c].coordenadas.latitude+'%2C'+prod[c].coordenadas.longitude+'&key=AIzaSyBUug4MX79d36HIpp0O0lnESVzj4xI9LYM','headers={"Content-Type": "application/json"}')
            console.log(coordenadasProveedores)
            let destinoFinal_Origen = new google.maps.LatLng(destino.lat, destino.lng);
            const servicio = new google.maps.DistanceMatrixService();
            servicio.getDistanceMatrix({
                origins:[destinoFinal_Origen],
                destinations:coordenadasProveedores,
                travelMode:'DRIVING'
            },this.distanciaServicio);
        },
        distanciaServicio(resp, status){
            console.log(resp)
            console.log(status)
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