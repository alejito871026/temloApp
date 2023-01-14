<template>
  <div>
      <div class="p-3 bg-primary text-center text-white"><h2>Vehiculos inscritos</h2></div>
        <table class="table table-hover" >
            <thead>
                <tr>
                    <th>Tipo vehiculo </th>
                    <th>Placas</th>
                    <th>Matriculado en</th>
                    <th>Seguro</th>
                    <th>Tecnomecanica</th>
                    <th>Modelo</th>
                </tr>
            </thead>
            <tbody>
                <!-- <tr v-for="ejecutivo in ejecutivos" :key="ejecutivo._id" >
                    <td @click="verEjecutivo(ejecutivo)">{{ejecutivo.nombreE+' '+ejecutivo.primerApellidoE+' '+ejecutivo.segundoApellidoE}}</td>
                    <td @click="verEjecutivo(ejecutivo)">{{ejecutivo.rol}}</td>
                    <td @click="verEjecutivo(ejecutivo)">{{ejecutivo.celularE}}</td>
                    <td>
                        <div class="btn-group">
                            <div class="btn btn-outline-primary btn-sm" @click="editarEjecutivo(ejecutivo)">Editar</div>
                            <div class="btn btn-outline-warning btn-sm" @click="verEdiciones(ejecutivo._id)">Ver ediciones</div>
                            <div class="btn btn-outline-danger btn-sm" @click="inactivarEjecutivo(ejecutivo._id)" v-if="ejecutivo.rol!='SUPERADMIN'">Inactivar empleado</div>
                        </div> 
                    </td>
                </tr> -->
            </tbody>
        </table>  
        <!-- <div v-if="ediciones.length>0">
            <div class="container border" v-for="edicion in ediciones" :key="edicion._id">
                {{edicion}}
            </div>
        </div> 
        <div class="btn-group col-md-12">
            <div class="btn btn-info" @click="verEjecutivosInactivos=true" v-if="verEjecutivosInactivos==false">Ver ejecutivos inactivos</div>
            <div class="btn btn-danger" @click="verEjecutivosInactivos=false" v-else>Cerrar ejecutivos inactivos</div>
        </div>
        <div v-if="ejecutivosInactivos.length>0 && verEjecutivosInactivos ==true">
            <div class="p-3 bg-primary text-center text-white"><h2>Empleados inactivos</h2></div>
            <table class="table table-hover" >
                <thead>
                    <tr>
                        <th>Nombre </th>
                        <th>Rol</th>
                        <th>Telefono</th>
                        <th>opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ejecutivo in ejecutivosInactivos" :key="ejecutivo._id" >
                        <td @click="verEjecutivo(ejecutivo)">{{ejecutivo.nombreE+' '+ejecutivo.primerApellidoE+' '+ejecutivo.segundoApellidoE}}</td>
                        <td @click="verEjecutivo(ejecutivo)">{{ejecutivo.rol}}</td>
                        <td @click="verEjecutivo(ejecutivo)">{{ejecutivo.celularE}}</td>
                        <td>
                            <div class="btn-group">
                                <div class="btn btn-outline-danger btn-sm" @click="activarEjecutivo(ejecutivo._id)" v-if="ejecutivo.rol!='SUPERADMIN'">Activar empleado</div>
                            </div> 
                        </td>
                    </tr>
                </tbody>
            </table>   
        </div> -->
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    computed: {
        ...mapState('storeAdminTemlo',['agregarVehiculo','verVehiculos'])
    },
    mounted(){
        //this.cargarVehiculoInscritos()
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoAgregarVehiculo','estadoVerVehiculos']),
    }
}
</script>

<style>

</style>