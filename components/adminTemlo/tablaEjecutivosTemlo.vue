<template>
    <div>
        <div class="p-3 bg-primary text-center text-white"><h2>Empleados Activos</h2></div>
        <table class="table table-hover" v-if="!agregarEjecutivoTemlo">
            <thead>
                <tr>
                    <th>Nombre </th>
                    <th>Rol</th>
                    <th>Telefono</th>
                    <th>opciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ejecutivo in ejecutivos" :key="ejecutivo._id" >
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
                </tr>
            </tbody>
        </table>  
        <div v-if="ediciones.length>0">
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
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
    data() {
        return{
            ejecutivos:[],
            ediciones:[],
            ejecutivosInactivos:[],
            verEjecutivosInactivos:false
        }
    },
    computed: {
        ...mapState('storeAdminTemlo',['agregarEjecutivoTemlo','verEjecutivos'])
    },
    mounted(){
        this.cargarTablaEjecutivos()
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoAgregarEjecutivoTemlo','estadoVerEjecutivos','estadoEjecutivoAeditar']),
        async cargarTablaEjecutivos() {
            this.ejecutivos = await this.$axios.$post('/empleadosTemlo/ejecutivos')
            this.ejecutivosInactivos = await this.$axios.$post('/empleadosTemlo/ejecutivosInactivos')
        },
        verEjecutivo(ejecutivo){
            console.log(ejecutivo)
        },
        editarEjecutivo(ejecutivo){
            this.estadoAgregarEjecutivoTemlo(true)  
            this.estadoVerEjecutivos(false)
            this.estadoEjecutivoAeditar(ejecutivo)                
        },
        async verEdiciones(_id){
            let id = {
                _id
            }
            const ediciones = await this.$axios.$post('/empleadosTemlo/edicionesEmpleados',id)
            this.ediciones = ediciones
        },
        async inactivarEjecutivo(_id){
            let id = {
                _id
            }
            const inactivo = await this.$axios.$post('/empleadosTemlo/inactivarEmpleados',id)
            if(inactivo){
                this.cargarTablaEjecutivos()
            }
        },
        async activarEjecutivo(_id){
            let id = {
                _id
            }
            const activo = await this.$axios.$post('/empleadosTemlo/reactivarEmpleados',id)
            if(activo){
                this.cargarTablaEjecutivos()
            }
        },
    }
}
</script>

<style>

</style>