<template>
    <div>
        <div v-if="!desahabilitado">
            <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="abrirRegistro" size="lg">
                <div class="card-body text-center" v-if="!cambiarContrasena">
                    <div class="bg-primary text-white p-3 mb-2 rounded">
                        <h3><strong>Registro clientes</strong></h3>
                    </div>
                    <div class="">
                        <div class="text-left mb-2">
                            El registro se ralizará mediante la validación de los datos que usted ingresará.
                        </div>
                        <b-list-group v-for="item in items" :key="item.id">
                            <b-list-group-item class="d-flex justify-content-between align-items-center mb-1" :disabled="item.disabled" :style="item.style">
                                <div class="text-left"><b-icon-info-circle ></b-icon-info-circle>&ensp;<a class="tex">{{item.info}}</a></div>
                                <div class="btn-group">
                                    <div class="btn btn-sm btn-outline-primary rounded" v-if="item.btn" @click="validar(item.id)">Validar</div> &ensp;
                                    <b-icon-envelope font-scale="1.8" v-if="item.id==1 && item.validate == false"></b-icon-envelope>
                                    <b-icon-envelope-open font-scale="1.8" v-if="item.id==1 && item.validate == true"></b-icon-envelope-open>
                                    <b-icon-phone font-scale="1.8" v-if="item.id==2 && item.validate == false"></b-icon-phone>
                                    <b-icon-phone-vibrate font-scale="1.8" v-if="item.id==2 &&  item.validate == true"></b-icon-phone-vibrate>
                                    <b-icon-person-check font-scale="1.8" v-if="item.id==3 && item.validate == false"></b-icon-person-check>
                                    <b-icon-person-check font-scale="1.8" v-if="item.id==3 && item.validate == true"></b-icon-person-check>
                                </div>
                            </b-list-group-item>
                        </b-list-group>
                        <div class="alert alert-danger">
                            Si abandonas o cierras esta pestaña sin completar todas las validaciones, ó si uno de las validaciones falla, 
                            <strong>se eliminara la informacion relacionada con el registro y debera realizar de nuevo el proceso.</strong>
                        </div>
                        <div v-if="!registrandose">
                            <div class="text-left">Si esta de acuerdo presione <strong>Ok</strong>, de lo contrario presione <strong>regresar.</strong></div>
                            <div class="btn btn-primary btn-block mt-1" @click="empezarRegistro(1)"><h5><strong>Ok</strong></h5></div>
                            <div class="btn btn-success btn-block" v-if="!abiertoDesdeInicioSesion" @click="estadoRegistroCliente(false)"><h5><strong><b-icon-arrow-left></b-icon-arrow-left> Regresar !</strong></h5></div> 
                            <div class="btn btn-primary btn-block" v-else @click="estadoRegistroCliente(false),estadoRegistroAbrir(false),estadoAbrirInicioSesion(true)"><h5><strong><b-icon-arrow-left></b-icon-arrow-left> Regresar !</strong></h5></div>
                        </div> 
                        <div v-else class="btn btn-outline-warning btn-block" @click="cancelarRegistro(1)"><strong><b-icon-arrow-left></b-icon-arrow-left>Cancelar registro</strong></div>
                    </div>
                </div>
            </b-modal>
            <b-modal v-model="openModal1" centered no-close-on-backdrop no-close-on-esc hide-footer hide-header>
                <div class="mb-2 bg-primary">
                    <h3 class="p-3 text-center text-white">REGISTRO CLIENTE</h3>
                </div>
                <form @submit.prevent="validandoMail(cliente,1)" v-if="!espera">
                    <div v-if="!validando1">
                        <div class="mb-2">
                            <span><h5><strong>Nombre completo</strong></h5></span>
                            <b-form-input v-model="cliente.nombreCompletoC" placeholder="Nombre completo" required></b-form-input>
                        </div>
                        <div class="mb-2 row">
                            <div class="col-md-6">
                                <span><h5><strong>Cedula de ciudadania</strong></h5></span>
                                <b-form-input v-model="cliente.cedulaC" type="number" placeholder="Cedula de ciudadania" required></b-form-input></div>
                            <div class="col-md-6">
                                <span><h5><strong>Fecha nacimiento</strong></h5></span>
                                <b-form-input type="date" v-model="cliente.fechaNacC" placeholder="Fecha nacimiento" required></b-form-input>
                            </div>                        
                        </div>
                        <div class="mb-2" >
                            <span><h5><strong>@Email</strong></h5></span>
                            <b-form-input v-model="cliente.emailC" placeholder="usuario" type="email" required></b-form-input>
                        </div>
                        <div class="mb-2 row">
                            <div class="col-md-6">
                                <span><h5><strong>Contraseña</strong></h5></span>
                                <b-input-group >
                                    <b-form-input :type="tipo" v-model="cliente.passC" placeholder="Password" @keyup="validarPassC()" required class="col-md-9"></b-form-input>
                                    <div class="border btn btn-group col-md-3 bg-light" v-if="!mirando" @click="mirando=true, tipo='text'">
                                        <b-icon-eye variant="success"></b-icon-eye>
                                    </div>
                                    <div class="border btn btn-group col-md-3 bg-light" v-else @click="mirando=false, tipo='password'">
                                        <b-icon-eye-slash variant="danger"></b-icon-eye-slash>
                                    </div>
                                </b-input-group>
                            </div>
                            <div class="col-md-6">
                                <span><h5><strong>Repetir contraseña</strong></h5></span>
                                <b-input-group >
                                    <b-form-input v-model="cliente.passC2" @keyup="validarPassC2()" placeholder="Password" type="password" required><div class="btn"></div></b-form-input>
                                </b-input-group>
                            </div>  
                            <div v-if="!sonIguales" class="mx-auto">
                                <a class="text" v-if="cliente.faltando1">Mas de 6 caracteres</a>
                                <a v-else class="text2">6 caracteres <b-icon-check></b-icon-check></a>
                                <a class="text" v-if="cliente.faltando2">Al menos 1 letra</a>
                                <a v-else class="text2">1 letra o mas <b-icon-check></b-icon-check></a>
                                <a class="text" v-if="cliente.faltando3">Al menos 1 numero</a>
                                <a v-else class="text2">1 numero o mas <b-icon-check></b-icon-check></a>
                                <a class="text">No son iguales</a>
                            </div> 
                            <div v-else class="mx-auto text2">
                                son iguales <b-icon-check variant="success"></b-icon-check>  
                            </div>                    
                        </div>
                        <div class="mb-2">
                            <div class="texto rounded">
                                Recuerde utilizar <strong>datos reales</strong>, ya que estos serán los datos a los cuales se registraran la compras y 
                                transacciones que se hagan por medio de la aplicación, así como  las facturas de compra y facturas digitales.
                            </div>
                            <div class="textoG rounded">
                                Visite nuestras politicas de 
                                <strong>
                                    <router-link :to="{path:'/', query:{id:'tratamientoDatos'}}" target="_blank">tratamiento de datos</router-link>
                                </strong>, y asegurece de estar de acuerdo.
                                <br><input type="checkbox" v-model="cliente.tyc" required>
                                <span> Acepte los terminos y condiciones</span>
                            </div>
                            
                            <button class="btn btn-primary btn-block" :disabled="!cliente.tyc" v-if="!validando1"><h5><strong>Iniciar registro</strong></h5></button>
                            <div class="btn btn-outline-primary btn-block" v-else @click="validandoMail(cliente.emailC,2,cliente.emailPass)"><strong>Validar codigokihgk</strong></div>
                            <div class="btn btn-outline-warning btn-block" @click="cancelarRegistro(1)"><strong><b-icon-arrow-left></b-icon-arrow-left>Cancelar registro</strong></div>
                        </div>
                    </div>
                    <div v-if="items[0].mailEnviado">
                        <div>Se a enviado un mail a <strong>{{cliente.emailC}}</strong>, con el codigo de verificacion. <br>
                            introducelo a continuacion
                        </div>
                        <div v-if="tiempo">
                            <strong>{{tempo1.minutos}}:<a v-if="tempo1.segundos<10">0</a>{{tempo1.segundos}}</strong>
                        </div>
                        <div class="mb-2" v-if="items[0].emailOportunidades<2">
                            <span><h5>Codigo de verificacion</h5></span>
                            <b-form-input type="password" v-model="cliente.emailPass" placeholder="Codigo de verificacion" required></b-form-input>
                            <div class="text-right">Oportunidades posibles {{2-items[0].emailOportunidades}}</div>
                            <div class="mb-2">
                                <button class="btn btn-outline-primary btn-block" v-if="!validando1"><strong>Registrar @email</strong></button>
                                <div class="btn btn-outline-primary btn-block" v-else @click="validandoMail(cliente.emailC,2,cliente.emailPass)"><strong>Validar codigo</strong></div>
                                <div class="btn btn-outline-warning btn-block" @click="cancelarRegistro(1)"><strong><b-icon-arrow-left></b-icon-arrow-left>Cancelar registro</strong></div>
                            </div>
                        </div>
                        <div v-else>
                            Agotaste las oprtunidades!
                        </div>
                    </div>
                </form>
                <div v-else class="mx-auto text-center">
                    <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                    <div class="alert alert-info">Por favor espere</div>
                </div>
            </b-modal>
            <b-modal v-model="openModal2" centered no-close-on-backdrop no-close-on-esc hide-footer hide-header>
                <form @submit.prevent="validandoSMS(cliente.celularC,1)" v-if="!espera">
                    <div class="mb-2" v-if="!validando2">
                        <div v-if="!items[1].smsEnviado">
                            Se enviara un mensaje de texto a su numero celular, para validar el numero de telefono, al cual seran notificadas compras o transacciones efectuadas dentro de la aplicadcion
                        </div>
                        <span><h3><strong>Numero de celular</strong></h3></span>
                        <b-form-input v-model="cliente.celularC" placeholder="Numero de celular" type="number" required></b-form-input>
                    </div>
                    <div v-if="items[1].smsEnviado">
                        <div>Se a enviado un sms <strong>{{cliente.celularC}}</strong>, con el codigo de verificacion. <br>
                            introducelo a continuacion
                        </div>
                        <div v-if="tiempo">
                            <strong>{{tempo1.minutos}}:{{tempo1.segundos}}</strong>
                        </div>
                        <div class="mb-2" v-if="items[1].smsOportunidades<2"><span><h5>Codigo de verificacion</h5></span>
                            <b-form-input type="password" v-model="cliente.celularPass" placeholder="Codigo de verificacion" required></b-form-input>
                            <div class="text-right">Oportunidades posibles {{2-items[1].smsOportunidades}}</div>
                        </div>
                        <div v-else>
                            Agotaste las oprtunidades!
                        </div>
                    </div>
                    <div class="mb-2">
                        <button class="btn btn-outline-primary btn-block" v-if="!validando2"><h5><strong>Enviar SMS</strong></h5></button>
                        <div class="btn btn-outline-primary btn-block" v-else @click="validandoSMS(cliente.celularC,2,cliente.celularPass)"><strong>Validar SMS</strong></div>
                        <div class="btn btn-outline-warning btn-block" @click="cancelarRegistro(1)"><strong><b-icon-arrow-left></b-icon-arrow-left>Cancelar registro</strong></div>
                    </div>
                </form>
                <div v-else class="mx-auto text-center">
                    <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                    <div class="alert alert-info">Por favor espere</div>
                </div>
            </b-modal>
            <b-modal v-model="openModal3" centered no-close-on-backdrop no-close-on-esc hide-footer hide-header>
                <div class="card" v-if="!espera">
                    <div class="p-2">
                        <span><h5><strong>Nombre</strong></h5></span>
                        <div class="form-control">{{cliente.nombreCompletoC}}</div>
                    </div>
                    <div class="p-2">
                        <span><h5><strong>Cedula</strong></h5></span>
                        <div class="form-control">{{cliente.cedulaC}}</div>
                    </div>
                    <div class="p-2">
                        <span><h5><strong>Email</strong></h5></span>
                        <div class="form-control">{{cliente.emailC}}</div>
                    </div>
                    <div class="p-2">
                        <span><h5><strong># Celular</strong></h5></span>
                        <div class="form-control">{{cliente.celularC}}</div>
                    </div>
                    <div class="p-2">
                        <div class="btn btn-outline-primary btn-block" @click="crear()"><h5><strong>Crear</strong></h5></div>
                        <div class="btn btn-outline-warning btn-block" @click="cancelarRegistro(1)"><strong><b-icon-arrow-left></b-icon-arrow-left>Cancelar registro</strong></div>
                    </div>
                </div>
                <div v-else class="mx-auto text-center">
                    <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                    <div class="alert alert-info">Por favor espere</div>
                </div>
            </b-modal>
        </div>
        <div v-else>
            exediste el limite de intentos
        </div>
    </div>  
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    computed : {
        ...mapState('storeInicioSesion',['cambiarContrasena', 'abrirRegistro','abiertoDesdeInicioSesion','idSocket']),
    },
    watch :{
        envios(n){
            if(n===5){
                this.deshabilitar()
            }
        },
    },
    data(){
        return{
            usuario:{},
            esProveedor:false,
            esTransportador:false,
            esEjecutivo:false,
            validarMsn : false,
            pass:undefined,
            contaPass:0,
            b:60,
            n:{},
            intervalo:{},
            contras: '',
            recuperarContrasena:false,
            registroCliente:false,
            cliente:{
                nombreCompletoC:'',
                cedulaC:'',
                celularC:'',
                emailC:'',
                fechaAgregado: new Date(),
                fechaNacC:'',
                emailPass:'',
                celularPass:'',
                passC:'',
                passC2:'',
                faltando1:false,
                faltando2:false,
                faltando3:false,
                tyc:false,
            },
            items:[
                {id:1,item:'Mail', emailOportunidades:0, mailEnviado:false, btn:false, validate:false, disabled:true, info:'Se validaran los datos y se enviara un email de validacion con el cual se generara su cuenta', style:{}},
                {id:2,item:'Celular', smsOportunidades:0, smsEnviado:false, btn:false, validate:false, disabled:true, info:'Se enviara un sms de verificacion al celular con el cual podra iniciar sesion, y validar compras en la aplicacion', style:{}},
                {id:3,item:'Crear', btn:false, validate:false, disabled:true, info:'Se procedera a la creacion del cliente', style:{}},
            ],
            validarMail:false,
            validarCedula:false,
            validarCelular:false,
            openModal1:false,
            openModal2:false,
            openModal3:false,
            validando1:false,
            validando2:false,
            tiempo:false,
            iintervalo:null,
            tempo1 : {},
            envios : 0,
            desahabilitado:false,
            registrandose:false,
            mirando:false,
            tipo:'password',
            sonIguales:false,
            espera:false,
        }
    },
    created(){
        this.contras = process.env.SECRET_KEY_TOKEN
        clearInterval(this.iintervalo)
    },
    methods:{
        ...mapMutations('storeInicioSesion',['estadoCambiarContrasena','estadoRegistroAbrir','estadoRegistroCliente','estadoAbrirInicioSesion']),
        empezarRegistro(a){
            this.registrandose = true
            if(a===1){
                this.items[0].disabled = false
                this.items[0].btn = true
                this.items[0].style = {
                    border: 'blue',
                    borderStyle:'solid'
                }                
            }
            if(a===2){
                this.items[1].disabled = false
                this.items[1].btn = true
                this.items[1].style = {
                    border: 'blue',
                    borderStyle:'solid'
                }                
            }
            if(a===3){
                this.items[2].disabled = false
                this.items[2].btn = true
                this.items[2].style = {
                    border: 'blue',
                    borderStyle:'solid'
                }                
            }
        },
        validar(id){
            if(id===1){
                this.openModal1=true
            }
            if(id===2){
                this.openModal2=true
            }
            if(id===3){
                this.openModal3=true
            }
        },
        deshabilitar(){
            if(!this.abiertoDesdeInicioSesion){
                this.estadoRegistroCliente(false)
                this.estadoRegistroAbrir(false)
                this.estadoAbrirInicioSesion(false)
            }else{
                this.estadoRegistroCliente(false)
                this.estadoAbrirInicioSesion(false)
            }
            this.desahabilitado = true
            clearInterval(this.iintervalo)
        },
        async validandoMail(cliente,n,emailPass){
            this.espera = true
            this.envios = this.envios + 1 
            const data = {
                nombreCompletoC:cliente.nombreCompletoC,
                cedulaC:cliente.cedulaC,
                fechaNacC:cliente.fechaNacC,
                passC2:cliente.passC2,
                emailC:cliente.emailC,
                socketId:this.idSocket
            }
            if(n===1){
                let r = await this.$axios.$post('/registroCliente/validarMail',data)
                if(r.status===201){
                    //this.items[0] = r.cliente
                    this.$swal.fire({
                        icon: 'info',
                        title: 'Este email',
                        text: 'Ya se encuentra registrado, puedes iniciar sesion ahora!',
                    })
                    if(this.envios==3){
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'As sobrepasado el limite de posibilidades, Actualiza la pagina y intenta de nuevo con tu numero celular',
                        })
                        this.cancelarRegistro(2)
                        this.cliente={
                            nombreCompletoC:'',
                            cedulaC:'',
                            celularC:'',
                            emailC:'',
                            fechaAgregado: new Date(),
                            fechaNacC:'',
                            emailPass:'',
                            celularPass:'',
                            passC:'',
                            passC2:'',
                            faltando1:false,
                            faltando2:false,
                            faltando3:false,
                            tyc:false,
                        }
                        this.envios = 0
                        if(!this.abiertoDesdeInicioSesion){
                            this.estadoRegistroCliente(false)
                            this.estadoRegistroAbrir(false)
                            this.estadoAbrirInicioSesion(true)
                        }else{
                            this.estadoRegistroCliente(false)
                            this.estadoAbrirInicioSesion(true)
                        }
                    }
                    this.espera = false
                }
                 if(r.status===202){
                    //this.items[0] = r.cliente
                    this.$swal.fire({
                        icon: 'info',
                        title: 'Esta cedula',
                        text: 'Ya se encuentra registrada, puedes iniciar sesion ahora!',
                    })
                    if(this.envios==3){
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'As sobrepasado el limite de posibilidades, intenta de nuevo con tu numero celular',
                        })
                        this.cancelarRegistro(2)
                        this.cliente={
                            nombreCompletoC:'',
                            cedulaC:'',
                            celularC:'',
                            emailC:'',
                            fechaAgregado: new Date(),
                            fechaNacC:'',
                            emailPass:'',
                            celularPass:'',
                            passC:'',
                            passC2:'',
                            faltando1:false,
                            faltando2:false,
                            faltando3:false,
                            tyc:false,
                        }
                        this.envios = 0
                        if(!this.abiertoDesdeInicioSesion){
                            this.estadoRegistroCliente(false)
                            this.estadoRegistroAbrir(false)
                            this.estadoAbrirInicioSesion(true)
                        }else{
                            this.estadoRegistroCliente(false)
                            this.estadoAbrirInicioSesion(true)
                        }
                    }
                    this.espera = false
                }
                if(r.status===200){
                    this.espera = false
                    this.items[0].mailEnviado = true
                    this.validando1 = true
                    this.rr = this.temporizador()
                    this.envios = 0
                }
                if(r.status===205){
                    this.espera = false
                    this.items[0].mailEnviado = false
                    this.validando1 = false
                    this.cliente.emailC = ''
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Este email ya se encuentra en proceso de registro',
                    })
                    if(this.envios==3){
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'As sobrepasado el limite de posibilidades, Actualiza la pagina y intenta de nuevo con tu numero celular',
                        })
                        this.cancelarRegistro(2)
                        this.cliente={
                            nombreCompletoC:'',
                            cedulaC:'',
                            celularC:'',
                            emailC:'',
                            fechaAgregado: new Date(),
                            fechaNacC:'',
                            emailPass:'',
                            celularPass:'',
                            passC:'',
                            passC2:'',
                            faltando1:false,
                            faltando2:false,
                            faltando3:false,
                            tyc:false,
                        }
                        this.envios = 0
                        if(!this.abiertoDesdeInicioSesion){
                            this.estadoRegistroCliente(false)
                            this.estadoRegistroAbrir(false)
                            this.estadoAbrirInicioSesion(true)
                        }else{
                            this.estadoRegistroCliente(false)
                            this.estadoAbrirInicioSesion(true)
                        }
                    }
                }
            }
            if(n===2){
                this.espera = true
                let r = await this.$axios.$post('/registroCliente/validarMail2',{emailC:this.cliente.emailC,emailPass})
                if(r===true){
                    this.espera = false
                    this.openModal1 = false
                    this.items[0].emailOportunidades = this.items[0].emailOportunidades + 1
                    this.items[0].validate = true
                    this.items[0].info = 'El @email a sido verificado'
                    this.items[0].btn = false
                    this.items[0].style = {
                        color:'green',
                        border:'green',
                        borderStyle:'solid'
                    } 
                    this.envios = 0
                    this.empezarRegistro(2)
                    clearInterval(this.iintervalo)
                    this.tempo1 = {}
                }else{
                    if(r.status===202){
                        this.espera = false
                        this.items[0].emailOportunidades = this.items[0].emailOportunidades + 1
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'le quedan '+this.items[0].emailOportunidades+' oportunidades',
                        })
                    }
                    if(r.status===203){
                        this.espera = false
                        this.items[0].emailOportunidades = this.items[0].emailOportunidades + 1
                        this.cancelarRegistro(2)
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Agotaste las oportunidades, se procedera a eliminar los datos asociados a el registro efectuado',
                        })
                        this.cliente={
                            nombreCompletoC:'',
                            cedulaC:'',
                            celularC:'',
                            emailC:'',
                            fechaAgregado: new Date(),
                            fechaNacC:'',
                            emailPass:'',
                            celularPass:'',
                            passC:'',
                            passC2:'',
                            faltando1:false,
                            faltando2:false,
                            faltando3:false,
                            tyc:false,
                        }
                        this.envios = 0
                    }
                }
            }
        },
        async validandoSMS(celularC,n,celularPass){
            this.envios = this.envios + 1
            if(n===1){
                let r = await this.$axios.$post('/registroCliente/validarSMS',{celularC,emailC:this.cliente.emailC})
                if(r.status===201){
                    this.items[1] = r.cliente
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Este numero de celular ya se encuentra registrado a otro usuario, porfavor ingrese otro numero personal',
                    })
                    this.cliente.celularC=''
                    if(this.envios == 3){
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'As sobrepasado el limite de posibilidades, intenta de nuevo con tu numero celular personal',
                        })
                        this.cancelarRegistro(2)
                        this.cliente={
                            nombreCompletoC:'',
                            cedulaC:'',
                            celularC:'',
                            emailC:'',
                            fechaAgregado: new Date(),
                            fechaNacC:'',
                            emailPass:'',
                            celularPass:'',
                            passC:'',
                            passC2:'',
                            faltando1:false,
                            faltando2:false,
                            faltando3:false,
                            tyc:false,
                        }
                        this.envios = 0
                        if(!this.abiertoDesdeInicioSesion){
                            this.estadoRegistroCliente(false)
                            this.estadoRegistroAbrir(false)
                            this.estadoAbrirInicioSesion(true)
                        }else{
                            this.estadoRegistroCliente(false)
                            this.estadoAbrirInicioSesion(true)
                        }
                    }
                    return
                }
                if(r.status===200){
                    this.envios = 0
                    this.items[1].smsEnviado = true
                    this.validando2 = true
                    this.rr = this.temporizador()
                }
                if(r.status===205){
                    this.items[1].smsEnviado = false
                    this.validando2 = false
                    this.cliente.celularC = ''
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'este numero celular ya se encuentra en proceso de registro',
                    })
                    if(this.envios == 3){
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'As sobrepasado el limite de posibilidades, Actualiza la pagina y intenta de nuevo con tu numero celular',
                        })
                        this.cancelarRegistro(2)
                        this.cliente={
                            nombreCompletoC:'',
                            cedulaC:'',
                            celularC:'',
                            emailC:'',
                            fechaAgregado: new Date(),
                            fechaNacC:'',
                            emailPass:'',
                            celularPass:'',
                            passC:'',
                            passC2:'',
                            faltando1:false,
                            faltando2:false,
                            faltando3:false,
                            tyc:false,
                        }
                        this.envios = 0
                        if(!this.abiertoDesdeInicioSesion){
                            this.estadoRegistroCliente(false)
                            this.estadoRegistroAbrir(false)
                            this.estadoAbrirInicioSesion(true)
                        }else{
                            this.estadoRegistroCliente(false)
                            this.estadoAbrirInicioSesion(true)
                        }
                    }
                }
            }
            //si le da a cancelar sin haber ingresado el codigo de verificacioan en mail se procedera a eliminar el dato luego de 10 min
            if(n===2){
                let r = await this.$axios.$post('/registroCliente/validarSMS2',{celularC,celularPass,emailC:this.cliente.emailC})
                if(r===true){
                    this.openModal2 = false
                    this.items[1].validate = true
                    this.items[1].info = 'El numero celular a sido verificado a sido verificado'
                    this.items[1].btn = false
                    this.items[1].style = {
                        color:'green',
                        border:'green',
                        borderStyle:'solid'
                    } 
                    this.empezarRegistro(3)
                    clearInterval(this.iintervalo)
                    this.tempo1 = {}
                    this.envios = 0
                }else{
                    if(r.status===202){
                        this.items[1].smsOportunidades = this.items[1].smsOportunidades + 1
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'le quedan '+this.items[1].smsOportunidades+' oportunidades'
                        })
                    }
                    if(r.status===203){
                        this.envios = 0
                        this.items[1].smsOportunidades = this.items[1].smsOportunidades + 1
                        this.$swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Agotaste las oportunidades, se procedera a eliminar los datos asociados a el registro efectuado, podras intenatrlo de nuevo en un momento'
                        })
                        this.cancelarRegistro(2)
                    }
                }
            }
        },
        async crear(){
            this.espera = true
            const data = this.cliente
            const creando = await this.$axios.$post('/registroCliente/crear',data)
            if(creando.success){
                this.cliente={
                    nombreCompletoC:'',
                    cedulaC:'',
                    celularC:'',
                    emailC:'',
                    fechaAgregado: new Date(),
                    fechaNacC:'',
                    emailPass:'',
                    celularPass:'',
                    passC:'',
                    passC2:'',
                    faltando1:false,
                    faltando2:false,
                    faltando3:false,
                    tyc:false,
                },
                this.$swal.fire({
                    icon: 'success',
                    title: 'En horabuena',
                    text: 'Se a guardado la informacion, ahora puedes iniciar sesion'
                })
                this.espera = false
                this.estadoRegistroCliente(false)
                this.estadoRegistroAbrir(false)
                this.estadoAbrirInicioSesion(true)
                this.openModal3=false
            }
        },
        cancelarRegistro(n){
            let email = this.cliente.emailC
            if(n==1){
                this.$swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: 'Se eliminaran los datos de nuestra base de datos, podras regritrarte de nuevo cuando quieras'
                })
            }
            this.registrandose = false
            this.openModal1=false; 
            this.cliente.emailC=null;
            this.cliente.emailPass=null;
            this.cliente.nombreCompletoC='',
            this.cliente.cedulaC='',
            this.cliente.passC='',
            this.cliente.passC2='',
            this.cliente.celularC=null;
            this.cliente.celularPass=null;
            this.cliente.fechaNacC =null;
            this.cliente.tyc = false
            this.items[0].validate = true;
            this.items[0].info = 'Se enviara un mail de vaidacion con el cual se generara su cuenta';
            this.items[0].disabled = true;
            this.items[0].validate = false;
            this.items[0].btn = false;
            this.items[0].mailEnviado = false; 
            this.items[0].style = {}; 
            if(this.validando1){
                clearInterval(this.iintervalo)
                this.validando1 = false
                this.eliminarRegistro(email)
            }
            this.openModal2=false;
            this.items[1].validate = true;
            this.items[1].info = 'Se enviara un sms de validacion al celular con el cual iniciara sesion';
            this.items[1].disabled = true;
            this.items[1].validate = false;
            this.items[1].btn = false;
            this.items[1].smsEnviado = false;
            this.items[1].style = {};
            if(this.validando2){
                clearInterval(this.iintervalo)
                this.validando2 = false
                this.eliminarRegistro(email)
            }
            this.openModal3=false;
            this.items[2].validate = true;
            this.items[2].info = 'Se creara el cliente con los datos verificados';
            this.items[2].disabled = true;
            this.items[2].validate = false;
            this.items[2].btn = false;
            this.items[2].style = {};
            if(this.validando3){
                clearInterval(this.iintervalo)
                this.validando3 = false
                this.eliminarRegistro(email)
            }
        },
        temporizador(){
            this.tiempo = true
            let minutos = 2
            let segundos = 59
            this.iintervalo = setInterval(() => {
                segundos=segundos-1
                if(segundos<10){
                    segundos = '0'+ segundos
                }
                this.tempo1 ={minutos,segundos}
                if(segundos==0){
                    minutos = minutos - 1
                    segundos = 59
                }
                if(minutos==-1){
                    this.cancelarRegistro()
                    return
                }
            }, 1000);
        },
        async eliminarRegistro(emailC){
            const elimiado = await  this.$axios.$post('/registroCliente/eliminarRegistro',{emailC})
            console.log('eliminado 688 modalRegistro')
            console.log(elimiado)
        },
        validarPassC(){
            if(this.cliente.passC.length < 6){
                this.cliente.faltando1 = 'Es muy corta la contrasena'
            }else{
                this.cliente.faltando1 = false
            }
            if(!this.cliente.passC.match(/[A-z]/)){
                this.cliente.faltando2 = 'Al menos una letra'
            }else{
                this.cliente.faltando2 =false
            }
            if(!this.cliente.passC.match(/\d/)){
                this.cliente.faltando3 = 'Al mennos un numero'
            }else{
                this.cliente.faltando3 = false
            }
            if(this.cliente.passC === this.cliente.passC2){
                this.sonIguales = true
            }else{
                this.sonIguales = false
            }
        },
        validarPassC2(){
            if(this.cliente.passC == ''){
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'primero debes escribir el password 1'
                })
                this.cliente.passC2 = ''
            }else{
                if(this.cliente.passC === this.cliente.passC2){
                    this.sonIguales = true
                }else{
                    this.sonIguales = false
                }
            }
            
        }
    },
}
</script>

<style>
 .texto {
     margin: 5px;
     padding: 5px;
     font-size:11px;
     border: solid 1px red;
 }
 .textoG {
     margin: 5px;
     padding: 5px;
     font-size:11px;
     border: solid 1px green;
 }
 .text {
     font-size:12px;
     color: red;
 }
 .text2 {
     font-size:12px;
     color: green;
 }
 .tex {
     font-size:13px;
     color: black;
 }
</style>