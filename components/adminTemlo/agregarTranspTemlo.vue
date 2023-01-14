<template>
    <div>
        <form @submit.prevent="crearTransportador()">
            <div class="card">
                <div class="card-header bg-primary text-white text-center p-4">
                    <h3>Agregar transportador</h3>
                </div>
                <div class="card-body">
                    <div class="p-1">
                        <strong>Nombre conductor</strong>
                        <b-form-input v-model="transportador.nombreT" type="text"  required></b-form-input>
                    </div>
                    <div class="p-1">
                        <strong>Primer apellido</strong>
                        <b-form-input v-model="transportador.primerApellidoT" type="text"  required></b-form-input>
                    </div>
                    <div class="p-1">
                        <strong>Segundo apellido</strong>
                        <b-form-input v-model="transportador.segundoApellidoT" type="text"   required></b-form-input>
                    </div>
                    <div class="p-1">
                        <strong>Cedula</strong>
                        <b-form-input v-model="transportador.cedulaT" type="text" required></b-form-input>
                    </div>
                    <div class="p-1" v-if="edicion">
                        <strong>Descripcion de la edicion</strong>
                        <textarea rows="2" class="form-control" v-model="transportador.descripcion"></textarea>
                    </div>           
                    <div class="p-1">
                        <strong>Telefono</strong>
                        <b-input-group>
                            <b-form-input  v-model="transportador.celularT" @keyup ="validateNumber()" type="text" required ></b-form-input>                                
                        </b-input-group>     
                        <span v-if="alert">Solo se permiten numeros</span>
                    </div>
                    <div class="p-1">
                        <strong>Direccion</strong>
                        <b-form-input type="text" v-model="transportador.direccionT"  required></b-form-input>
                    </div>
                    <div class="p-1">
                        <strong>Email</strong>
                        <b-form-input type="email" v-model="transportador.emailT"  required></b-form-input>
                    </div>
                    <div class="p-1">
                        <strong>Fecha naciemiento</strong>
                        <b-form-input type="date" v-model="transportador.fechaNacT"  required></b-form-input>
                    </div>
                </div>            
                <div class="card-footer bg-white" v-if="edicion">
                    <div class="btn btn-success btn-block" @click="guardarEdicionTransportador()"><strong><strong>Guardar edicion transportador</strong></strong></div>
                    <div class="btn btn-warning btn-block" @click="cerrarAgregarTransportador()"><strong>Cerrar</strong></div>
                </div>
                <div class="card-footer bg-white" v-else>
                    <button class="btn btn-success btn-block"><strong>Guardar transportador</strong></button>
                    <div class="btn btn-warning btn-block" @click="cerrarAgregarTransportador()"><strong>Cerrar</strong></div>
                </div> 
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
            transportador:{
                nombreT:'',
                primerApellidoT:'',
                segundoApellidoT:'',
                cedulaT:'',
                celularT:'',
                direccionT:'',
                emailT:'',
                fechaNacT:'',
            },
            alert:false,
            edicion: false,
        }
    },
    computed:{
        ...mapState('storeAdminTemlo',['transportadorAeditar'])
    },
    created(){
        this.validarProps()
    },
    methods: {
        ...mapMutations('storeAdminTemlo',['estadoAgregarTransportador','estadoActualizarTablaTransportadores','estadoTransportadorAeditar']),
        validateNumber() {
            let a = this.transportador.celularT
            if(this.transportador.celularT.match(/[^0-9]/)){
                this.alert = true
                return this.transportador.celularT = ''
            }else{
              this.alert = false  
            }
        },
        cerrarAgregarTransportador(){
            this.estadoAgregarTransportador(false)
            this.transportador = {
                nombreT:'',
                primerApellidoT:'',
                segundoApellidoT:'',
                cedulaT:'',
                celularT:'',
                direccionT:'',
                emailT:'',
                fechaNacT:'',
            }
            if(this.edicion==true){
                this.estadoTransportadorAeditar(false)
                this.edicion = false
            }
        },
        async crearTransportador(){
            if(this.transportador.nombreT == '' || this.transportador.primerApellidoT == '' || 
                this.transportador.segundoApellidoT == '' ||this.transportador.cedulaT == '' ||
                this.transportador.celularT == '' || this.transportador.direccionT == '' ||
                this.transportador.emailT == '' || this.transportador.fechaNacT == '' )
            {
                alert('Campos sin diligenciar')
                return
            }else{
                const creado = await this.$axios.$post('/tYv/guardarTransportador',this.transportador)
                console.log(creado)
                if(creado.status===200){
                    this.transportador = {
                        nombreT:'',
                        primerApellidoT:'',
                        segundoApellidoT:'',
                        cedulaT:'',
                        celularT:'',
                        direccionT:'',
                        emailT:'',
                        fechaNacT:'',
                    }
                    this.estadoAgregarTransportador(false)
                    this.estadoActualizarTablaTransportadores(true)
                }
                if(creado.status===205){
                    this.$auth.logout()
                }
                if(creado.status===204){
                    console.log(creado)
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
                if(creado.status===203){
                    alert(creado.message)
                }              
            }           
        },
        async validarProps(){
            if(this.transportadorAeditar){
                this.edicion=true
                this.transportador.nombreT=this.transportadorAeditar.nombreT 
                this.transportador.primerApellidoT = this.transportadorAeditar.primerApellidoT 
                this.transportador.segundoApellidoT = this.transportadorAeditar.segundoApellidoT
                this.transportador.cedulaT = this.transportadorAeditar.cedulaT 
                this.transportador.celularT = this.transportadorAeditar.celularT 
                this.transportador.direccionT = this.transportadorAeditar.direccionT 
                this.transportador.emailT = this.transportadorAeditar.emailT 
                this.transportador.rol = this.transportadorAeditar.rol 
                this.transportador.fechaNacT = this.verFecha(this.transportadorAeditar.fechaNacT)
                this.transportador._id = this.transportadorAeditar._id
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
        async guardarEdicionTransportador(){
            if(this.transportador.descripcion==''||this.transportador.descripcion==undefined){
                alert('Describe la edicion')
                return
            }else if(this.transportador.descripcion.length<10){
                alert('Agrega una descripcion mas completa, que contenga mas de 10 caracteres')
            }else{
                this.transportador.id_empleado = this.$auth.user._id
                const guardarEdicion = await this.$axios.$post('/tYv/guardarEdicionTransportador',this.transportador)
                if(guardarEdicion.status === 200){
                    this.transportador = {}
                    this.estadoAgregarTransportador(false)
                    this.estadoActualizarTablaTransportadores(true)
                    this.estadoTransportadorAeditar(false)
                }
                console.log(guardarEdicion)
            }

        }
        
    },
}
</script>

<style>

</style>