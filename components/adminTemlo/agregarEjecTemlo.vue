<template>
    <div>
        <form @submit.prevent="crearEjecutivoTemlo()">
            <div class="row">
                <div class="col-md-6 border border-primary">
                    <div class="p-3">
                        <span><h3>Nombre Empleado</h3></span>
                        <b-form-input v-model="empleado.nombreE" type="text"  required></b-form-input>
                    </div>
                    <div class="p-3">
                        <span><h3>Primer apellido</h3></span>
                        <b-form-input v-model="empleado.primerApellidoE" type="text"  required></b-form-input>
                    </div>
                    <div class="p-3">
                        <span><h3>Segundo apellido</h3></span>
                        <b-form-input v-model="empleado.segundoApellidoE" type="text"   required></b-form-input>
                    </div>
                    <div class="p-3">
                        <span><h3>Cedula</h3></span>
                        <b-form-input v-model="empleado.cedulaE" type="text" required></b-form-input>
                    </div>
                    <div class="p-3" v-if="edicion">
                        <span><h3>Descripcion de la edicion</h3></span>
                        <textarea rows="2" class="form-control" v-model="empleado.descripcionEdicion"></textarea>
                    </div>
                </div>
                <div class="col-md-6 border border-primary">
                    <div class="p-3">
                        <b-form-group>
                            <span><h3>Telefonos</h3></span>
                            <b-input-group>
                                <b-form-input  v-model="empleado.celularE" @keyup ="validateNumber()" type="text" required ></b-form-input>                                
                            </b-input-group>     
                            <span v-if="alert">Solo se permiten numeros</span>
                        </b-form-group>
                    </div>
                    <div class="p-3">
                        <span><h3>Direccion</h3></span>
                        <b-form-input type="text" v-model="empleado.direccionE"  required></b-form-input>
                    </div>
                    <div class="p-3">
                        <span><h3>Email</h3></span>
                        <b-form-input type="email" v-model="empleado.emailE"  required></b-form-input>
                    </div>
                    <div class="p-3">
                        <span><h3>Fecha naciemiento</h3></span>
                        <b-form-input type="date" v-model="empleado.fechaNacE"  required></b-form-input>
                    </div>
                    <div class="p-3">
                        <span><h3>Rol</h3></span>
                        <b-select v-model="empleado.rol" :options="options"></b-select>
                    </div>
                </div>
            </div>
            <div class="card-footer bg-white" v-if="edicion">
                <div class="btn btn-success btn-block" @click="guardarEdicionEjecutivo()"><h3><strong>Guardar edicion empleado</strong></h3></div>
            </div>
            <div class="card-footer bg-white" v-else>
                <button class="btn btn-success btn-block"><h3><strong>Guardar empleado</strong></h3></button>
            </div>             
        </form>                          
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    middleware: 'auth',
    data(){
        return{
            empleado:{
                celularE:'',
            },
            alert:false,
            options:['SUPERADMIN','Admin','Ejecutivo'],
            edicion: false,
        }
    },
    computed:{
        ...mapState('storeAdminTemlo',['actualizarTablaEjecutivos','ejecutivoAeditar'])
    },
    created(){
        this.validarProps()
    },
    methods: {
        ...mapMutations('storeAdminTemlo',['estadoAgregarEjecutivoTemlo','estadoVerEjecutivos','estadoEjecutivoAeditar']),
        validateNumber() {
            let a = this.empleado.celularE
            if(this.empleado.celularE.match(/[^0-9]/)){
                this.alert = true
                return this.empleado.celularE = ''
            }else{
              this.alert = false  
            }
        },
        async crearEjecutivoTemlo(){
            const empleado = this.empleado
            if(this.empleado.nombreE =='' || this.empleado.nombreE == undefined || 
                this.empleado.primerApellidoE =='' || this.empleado.primerApellidoE == undefined || 
                this.empleado.segundoApellidoE =='' || this.empleado.segundoApellidoE == undefined || 
                this.empleado.celularE =='' || this.empleado.celularE == undefined || 
                this.empleado.cedulaE =='' || this.empleado.cedulaE == undefined || 
                this.empleado.direccionE =='' || this.empleado.direccionE == undefined || 
                this.empleado.emailE =='' || this.empleado.emailE == undefined || 
                this.empleado.fechaNacE =='' || this.empleado.fechaNacE == undefined || 
                this.empleado.rol =='' || this.empleado.rol == undefined ){
                    alert('Campos sin diligenciar')
                    return
                }else{
                    empleado.empresa=this.$auth.$state.user.empresa
                    const creado = await this.$axios.$post('/empleadosTemlo/guardarEmpleado',empleado)
                    if(creado.status===200){
                        this.empleado = {}
                        this.estadoAgregarEjecutivoTemlo(false)
                        this.estadoVerEjecutivos(true)
                    }
                    if(creado.status===205){
                        this.$auth.logout()
                    }
                    if(creado.status===204){
                        let mens = ''
                        for(var property in creado.error) {
                            //console.log(creado.error[property])
                            mens = creado.error[property];
                        }
                        alert(' Este dato ya se encuentra registrado '+ mens)
                    }
                    if(creado.status===206){
                        alert(creado.message)
                    }
                    
                }
            
        },
        async validarProps(){
            if(this.ejecutivoAeditar){
                this.edicion=true
                this.empleado.nombreE=this.ejecutivoAeditar.nombreE 
                this.empleado.primerApellidoE = this.ejecutivoAeditar.primerApellidoE 
                this.empleado.segundoApellidoE = this.ejecutivoAeditar.segundoApellidoE 
                this.empleado.cedulaE = this.ejecutivoAeditar.cedulaE 
                this.empleado.celularE = this.ejecutivoAeditar.celularE 
                this.empleado.direccionE = this.ejecutivoAeditar.direccionE 
                this.empleado.emailE = this.ejecutivoAeditar.emailE 
                this.empleado.rol = this.ejecutivoAeditar.rol 
                this.empleado.fechaNacE = this.verFecha(this.ejecutivoAeditar.fechaNacE)
                this.empleado._id = this.ejecutivoAeditar._id
            }else{
                this.edicion=false
            }
        },
        verFecha(fecha){
            let fechaNacCliente =""
            for (let a = 0; a < 10; a++) {
                fechaNacCliente = fechaNacCliente + fecha[a]; 
            }
            return fechaNacCliente
        },
        async guardarEdicionEjecutivo(){
            if(this.empleado.descripcionEdicion==''||this.empleado.descripcionEdicion==undefined){
                alert('Describe la edicion')
                return
            }else{
                this.empleado.idEmpleadoEditor = this.$auth.$state.user._id
                const empleado = this.empleado
                const guardarEdicion = await this.$axios.$post('/empleadosTemlo/guardarEdicionEjecutivo',empleado)
                if(guardarEdicion.status === 200){
                    this.empleado = {}
                    this.estadoAgregarEjecutivoTemlo(false)
                    this.estadoVerEjecutivos(true)
                    this.estadoEjecutivoAeditar(false)
                }
                //console.log(guardarEdicion)
            }

        }
        
    },
}
</script>

<style>

</style>