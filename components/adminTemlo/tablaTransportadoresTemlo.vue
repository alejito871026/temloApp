<template>
    <div>
        <div class="p-3 bg-primary text-center text-white"><h2>Transportadores</h2></div>
        <table class="table table-hover">
            <thead>
                <tr class="text-center">
                    <th>On</th>
                    <th>Nombre </th>
                    <th>Telefono</th>
                    <th>Ubicacion</th>
                    <th>opciones</th>                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="transportador in transportadores" :key="transportador._id" >
                    <td>
                        <div v-bind="verOnline(transportador._id)">
                            <b-avatar size="sm" variant="success"></b-avatar>
                        </div>
                    </td>
                    <td @click="verTransportador(transportador)">{{transportador.nombreT+' '+transportador.primerApellidoT+' '+transportador.segundoApellidoT}}</td>
                    <td @click="verTransportador(transportador)">{{transportador.celularT}}</td>
                    <td @click="verTransportadorUbicacion(transportador)" class="btn btn-info text-danger text-center btn-block"><b-icon-geo scale="2"></b-icon-geo>{{transportador.ubicacion}}</td>
                    <td>
                        <div class="btn-group">
                            <div class="btn btn-outline-primary btn-sm" @click="editarTransportador(transportador)">Editar</div>
                            <div class="btn btn-outline-warning btn-sm" @click="verEdiciones(transportador._id)">Ver ediciones</div>
                            <div class="btn btn-outline-danger btn-sm" @click="inactivacion(transportador._id)" v-if="$auth.user.rol=='SUPERADMIN' || $auth.user.rol=='ADMIN' ">Inactivar Transp</div>
                        </div> 
                    </td>
                </tr>
            </tbody>
        </table>  
        <div v-if="ediciones.length>0">
            <div class="container border" v-for="edicion in ediciones" :key="edicion._id">
                {{edicion}}
            </div>
            <div class="btn btn-block btn-danger" @click="ediciones = []">Cerrar ediciones</div>
        </div> 
        <div class="btn-group col-md-12">
            <div class="btn btn-info" @click="verTransportadoresInactivos=true" v-if="verTransportadoresInactivos==false">Ver trasnportadores inactivos</div>
            <div class="btn btn-danger" @click="verTransportadoresInactivos=false" v-else>Cerrar trasnportadores inactivos</div>
        </div>
        <div v-if="transportadoresInactivos.length>0 && verTransportadoresInactivos ==true">
            <div class="p-3 bg-primary text-center text-white"><h2>Transportadores no activos</h2></div>
            <table class="table table-hover" >
                <thead>
                    <tr>
                        <th>Nombre </th>
                        <th>Telefono</th>
                        <th>Ubicacion</th>
                        <th>opciones</th>                    
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transportador in transportadoresInactivos" :key="transportador._id" >
                        <td @click="verTransportador(transportador)">{{transportador.nombreT}}</td>
                        <td @click="verTransportador(transportador)">{{transportador.celularT}}</td>
                        <td @click="verTransportador(transportador)">{{transportador.celularT}}</td>
                        <td>
                            <div class="btn-group">
                                <div class="btn btn-outline-danger btn-sm" @click="reactivacion(transportador._id)" v-if="$auth.user.rol!='SUPERADMIN' || $auth.user.rol!='ADMIN'">Reactivar transp</div>
                            </div> 
                        </td>
                    </tr>
                </tbody>
            </table>   
        </div>
        <b-modal centered hide-footer hide-header no-close-on-backdrop no-close-on-esc v-model="inactivar">
            <div class="card">
                <div class="card-header bg-primary text-white text-center"><h4>Esta seguro de inactivar el transportador?</h4></div>
                <div class="card-body">                    
                    <div class="p-1">
                        <strong><h5>ingrese a continuacion el motivo por el cual se inactiva el transportador</h5></strong>
                        <textarea v-model="descripcion" class="form-control" required></textarea>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="btn btn-outline-danger btn-block" @click="inactivar=false, descripcion='', idTransportador = ''">Cancelar inactivacion</div>
                    <div class="btn btn-outline-info btn-block" @click="inactivarTransportador()">Inactivar transportador</div>
                </div>
            </div>
        </b-modal>
        <b-modal centered hide-footer hide-header no-close-on-backdrop no-close-on-esc v-model="reactivar">
            <div class="card">
                <div class="card-header bg-primary text-white text-center"><h4>Esta seguro de reactivar el transportador?</h4></div>
                <div class="card-body">                    
                    <div class="p-1">
                        <strong><h5>ingrese a continuacion el motivo por el cual se reactiva el transportador</h5></strong>
                        <textarea v-model="descripcion" class="form-control" required></textarea>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="btn btn-outline-danger btn-block" @click="reactivar=false, descripcion='', idTransportador = ''">Cancelar reactivacion</div>
                    <div class="btn btn-outline-info btn-block" @click="activarTransportador()">Activar transportador</div>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
import { promise } from 'bcrypt/promises'
import {mapState, mapMutations} from 'vuex'
export default {
    data() {
        return{
            transportadores:[],
            ediciones:[],
            transportadoresInactivos:[],
            verTransportadoresInactivos:false,
            descripcion:'',
            inactivar:false,
            reactivar:false,
            idTransportador:'',
        }
    },
    computed: {
        ...mapState('storeAdminTemlo',['actualizarTablaTransportadores'])
    },
    watch:{
        actualizarTablaTransportadores(n){
            console.log(n)
            if(n){
                this.cargarTablaTransportadores()
            }
        }
    },
    mounted(){
        this.cargarTablaTransportadores()
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoAgregarTransportador','estadoTransportadorAeditar']),
        async cargarTablaTransportadores() {
            this.transportadores = await this.$axios.$post('/tYv/transportadores')
            this.transportadoresInactivos = await this.$axios.$post('/tYv/transportadoresInactivos')
        },
        async verOnline(_id){
            const online = await this.$axios.$post('/tYv/verOnline',{_id})
            console.log(online)
            return online
        },
        verTransportador(transportador){
            console.log(transportador)
        },
        editarTransportador(transportador){
            this.estadoAgregarTransportador(true)  
            this.estadoTransportadorAeditar(transportador)                
        },
        async verEdiciones(_id){
            let id = {
                _id
            }
            this.ediciones = await this.$axios.$post('/tYv/edicionesTransportador',id)
        },
        inactivacion(_id){
            this.inactivar = true
            this.idTransportador = _id
        },
        async inactivarTransportador(){
            if(this.descripcion.length<15){
                this.$swal.fire({
                    icon:'info',
                    title:'Algo salio mal !!!',
                    text:'Agrega una descripcion mas completa, que contenga mas de 15 caracteres'
                })
            }else{
                const data = {
                    _id:this.idTransportador,
                    id_empleado:this.$auth.user._id,
                    descripcion:this.descripcion,
                    motivo:'Inactivacion',
                }
                const inactivo = await this.$axios.$post('/tYv/inactivarTransportador',data)
                if(inactivo){
                    this.cargarTablaTransportadores()
                    this.inactivar = false
                    this.descripcion = ''
                }
            }
            
        },
        reactivacion(_id){
            this.reactivar = true
            this.idTransportador = _id
        },
        async activarTransportador(){
            if(this.descripcion.length<15){
                this.$swal.fire({
                    icon:'info',
                    title:'Algo salio mal !!!',
                    text:'Agrega una descripcion mas completa, que contenga mas de 15 caracteres'
                })
            }else{
                const data = {
                    _id:this.idTransportador,
                    id_empleado:this.$auth.user._id,
                    descripcion:this.descripcion,
                    motivo:'Re-activacion',
                }
                const activo = await this.$axios.$post('/tYv/reactivarTransportador',data)
                if(activo){
                    this.cargarTablaTransportadores()
                    this.reactivar = false
                    this.descripcion = ''
                }
            }
        },
    }
}
</script>

<style>

</style>