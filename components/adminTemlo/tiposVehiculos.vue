<template>
    <div class="border border-info m-2 p-3">
        <div class="row m-2 pb-2 justify-content-end"><div class="btn btn-success" @click="agregar=true">Agregar nuevo tipo de vehiculo</div></div>
        <b-modal v-model="agregar" centered hide-footer hide-header no-close-on-backdrop no-close-on-esc size="md">
            <div class="card">
                <div class="card-header bg-white text-center">
                    <h3>Agregar tipo vehiculo</h3>
                </div>
                <div class="card-body">
                    <form @submit.prevent="guardarTipoVehiculo()">
                        <div v-if="espera" class="text-center">
                            <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                            <div class="alert alert-info">Por favor espere</div>
                        </div>
                        <div v-else>
                            <div class="mb-3">
                                <strong>Nombre tipo</strong>
                                <b-form-input type="text" v-model="vehiculo.nombreTipo" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Cantidad de ejes</strong>
                                <b-form-input type="number" v-model="vehiculo.ejes" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Capacidad minima de peso en kg</strong>
                                <b-form-input type="number" min="1" step="0.01" v-model.number="vehiculo.capacidadPesoMin" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Capacidad minima de peso en kg</strong>
                                <b-form-input type="number" min="1" step="0.01" v-model.number="vehiculo.capacidadPesoMAx" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Largo del volco en metros</strong>
                                <b-form-input type="number" min="1" step="0.01" v-model.number="vehiculo.largo" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Ancho del volco en metros</strong>
                                <b-form-input type="number" min="1" step="0.01" v-model.number="vehiculo.ancho" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Alto del volco en metros </strong>
                                <b-form-input type="number" min="1" step="0.01" v-model.number="vehiculo.alto" required></b-form-input>
                            </div>
                            <div class="mb-3">
                                <strong>Cuenta con carpa o proteccion al agua</strong>
                                <select v-model="vehiculo.proteccionAgua" class="form-control">
                                    <option :value="true">Si</option>
                                    <option :value="false">No</option>
                                </select>
                            </div>
                            <button class="btn btn-success btn-block">Guardar tipo vehiculo</button>
                        </div>
                    </form>
                </div>
                <div class="card-footer bg-white">
                    <div class="btn btn-block btn-warning"  @click="agregar=false">Cerrar</div>
                </div>
            </div>
        </b-modal>
        <div class="m-2">
            <table class="table table-hover table-sm">
                    <thead>
                        <tr>
                            <th>Tipo vehiculo </th>
                            <th># De ejes</th>
                            <th>Cap min Kg</th>
                            <th>Cap max Kg</th>
                            <th>Largo</th>
                            <th>Ancho</th>
                            <th>Alto</th>
                            <th>Proteccion al agua</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="vehiculo in tipos" :key="vehiculo._id" >
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.nombreTipo}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.ejes}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.capacidadPesoMin}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.capacidadPesoMAx}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.largo}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.ancho}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.alto}}</td>
                            <td @click="vervehiculo(vehiculo)">{{vehiculo.proteccionAgua}}</td>
                            <td>
                                <div class="btn-group">
                                    <div class="btn btn-outline-primary btn-sm" @click="editarvehiculo(vehiculo)">Editar</div>
                                    <div class="btn btn-outline-warning btn-sm" @click="verEdiciones(vehiculo._id)">Ver ediciones</div>
                                    <!-- <div class="btn btn-outline-danger btn-sm" @click="inactivarvehiculo(vehiculo._id)" v-if="vehiculo.rol!='SUPERADMIN'">Inactivar empleado</div> -->
                                </div> 
                            </td>
                        </tr>
                    </tbody>
            </table>
            <div class="btn btn-danger btn-block" @click="estadoVerTiposVehiculos(false)"><h3><strong>Cerrar</strong></h3></div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    computed:{
        ...mapState('storeAdminTemlo',['verTiposVehiculos']),
    },
    created(){
        this.cargarTabalaTiposVehiculos()
    },
    data(){
        return{
            agregar:false,
            espera:false,
            tipos:[],
            vehiculo:{
                nombreTipo:'',
                capacidadPesoMin:'',
                capacidadPesoMAx:'',
                largo:'',
                ancho:'',
                alto:'',
                ejes:'',
                proteccionAgua:false,
            },
        }
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoVerTiposVehiculos']),
        async cargarTabalaTiposVehiculos(){
            this.tipos = await this.$axios.$post('/tYv/cargarTiposVehiculos')
        },
        async guardarTipoVehiculo(){
            const guardarOk = await this.$axios.$post('/tYv/guardarTiposVehiculos',this.vehiculo)
            if(guardarOk.success){
                this.$swal.fire({
                    icon:'success',
                    title:'Muy bien !!!',
                    text:'Se a guardado el nuevo tipo de vehiculo'
                })
                this.cargarTabalaTiposVehiculos()
            }else{
                if(guardarOk.error.code === 11000){
                    this.$swal.fire({
                        icon:'error',
                        title:'Algo salio mal !!!',
                        text:'Ya existe un tipo de vehiculo con este nombre'
                    })
                }else{
                    this.$swal.fire({
                        icon:'error',
                        title:'Algo salio mal !!!',
                        text:guardarOk.error.message
                    })
                }
            }
        },
    }
}
</script>

<style>

</style>