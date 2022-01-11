<template>
    <div>
        <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="abrirInicioSesion">
            <div class="card-body  mx-auto col-md-12" v-if="!cambiarContrasena">
                <div class="bg-primary text-white p-3 mb-3 rounded">
                    <h3 class="text-center"><strong>Inicio sesion</strong></h3>
                </div>
                <form @submit.prevent="inicioSesion(1)">
                    <div v-if="espera" class="text-center">
                        <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                        <div class="alert alert-info">Por favor espere</div>
                    </div>
                    <div v-else>
                        <div v-if="!otrasManerasInicio">
                            <div class="mb-3">
                                <strong>#Celular, @email o usuario</strong>
                                <b-form-input v-model="usuario.user" placeholder="Identificate" required></b-form-input>
                            </div>
                            <div class="mb-3" >
                                <strong>Contraseña</strong>
                                <b-form-input type="password" v-model="usuario.pass" placeholder="contraseña" required></b-form-input>
                            </div>
                            <a class="nav-link d-md-flex justify-content-md-end " @click="otrasManerasInicio=true, usuario.user = '', usuario.pass = ''">Inicia sesion con SMS o EMAIL</a>
                        </div>
                        <div v-if="otrasManerasInicio">
                            <div class="row tex-center mx-auto"  v-if="!validarMAIL && !validarSMS">
                                <div class="col-sm-6" >
                                <div class="custom-control custom-switch bg-white text-dark">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch1" @click="ingresar.mail=false" v-model="ingresar.cel">
                                    <label class="custom-control-label" for="customSwitch1">&ensp;  Con SMS &ensp; <b-icon-phone-vibrate></b-icon-phone-vibrate></label>
                                </div>
                                </div>
                                <div class="col-sm-6">                  
                                <div class="custom-control custom-switch bg-white text-dark">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch2" @click="ingresar.cel=false" v-model="ingresar.mail" >
                                    <label class="custom-control-label" for="customSwitch2" >&ensp; Con @Email &ensp; <b-icon-envelope></b-icon-envelope></label>
                                </div>
                                </div>
                            </div>
                            <div class="mb-2" v-if="ingresar.cel">
                                <div v-if="!validarSMS">
                                    <br> Se enviara un SMS al su celular con el codigo de inicio.
                                    <strong class="mb-2">Ingresa tu numero celular</strong>
                                    <b-form-input type="tel"  v-model="usuario.celular" placeholder="# celular" required></b-form-input>
                                    <div class="btn btn-outline-primary btn-sm mt-2 btn-block" @click="inicioSesion(2)">Enviar SMS con codigo de inicio</div>
                                </div>
                                <div v-else>
                                    <div>Se a enviado un sms <strong>{{usuario.celular}}</strong>, con el codigo de verificacion. <br>
                                        introducelo a continuacion
                                    </div>
                                    <div class="mb-2" v-if="contaPass<2"><span><h5>Codigo de verificacion</h5></span>
                                    <strong>{{tempo.minutos}}:{{tempo.segundos}}</strong>
                                        <b-form-input type="password" v-model="celularPass" placeholder="Codigo de verificacion" required></b-form-input>
                                        <div class="text-right">Oportunidades posibles {{2 - contaPass}}</div>
                                        <div class="btn btn-outline-primary btn-block" @click="validandoSMS()">Validar SMS</div>
                                    </div>
                                    <div v-else>
                                        Agotaste las oprtunidades!
                                    </div>
                                </div>
                            </div>
                            <div class="mb-2" v-if="ingresar.mail">
                                <div v-if="!validarMAIL">
                                    <br> Se enviara un EMAIL al su correo electronico con el codigo de inicio. <br>
                                    <strong class="mb-2">Ingresa tu email</strong>
                                    <b-form-input type="email" class="mt-2" v-model="usuario.emailC" placeholder="Identificate" required></b-form-input>
                                    <div class="btn btn-outline-primary btn-sm mt-2 btn-block" @click="inicioSesion(3)">Enviar EMAIL con codigo de inicio</div>
                                </div>
                                <div v-else>
                                    <div>Se a enviado un EMAIL <strong>{{usuario.emailC}}</strong>, con el codigo de verificacion. <br>
                                        introducelo a continuacion
                                    </div>
                                    <div class="mb-2" v-if="contaPass<2"><span><h5>Codigo de verificacion</h5></span>
                                        <strong>{{tempo.minutos}}:{{tempo.segundos}}</strong>
                                        <b-form-input type="password" v-model="emailPass" placeholder="Codigo de verificacion" required></b-form-input>
                                        <div class="text-right">Oportunidades posibles {{2 - contaPass}}</div>
                                        <div class="btn btn-outline-primary btn-block" @click="validandoMAIL()">Validar EMAIL</div>
                                    </div>
                                    <div v-else>
                                        Agotaste las oprtunidades!
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-2" v-if="!validarMAIL && !validarSMS">
                            <a class="nav-link d-md-flex justify-content-md-end " @click="otrasManerasInicio=false" v-if="otrasManerasInicio">Inicio de sesion tradicional</a>
                            <button class="btn btn-outline-primary btn-block mb-2" v-if="!otrasManerasInicio"><strong>Ingresa!</strong></button>
                            <!-- <div class="btn btn-outline-info btn-block" @click="inicioSesion(2)" v-else><h5><strong>Ingresa!!</strong></h5></div> -->
                            <div class="text-info">Aun no estas registrado?</div>
                            <div class="btn btn-outline-success btn-block mb-2" @click="estadoRegistroCliente(true),estadoRegistroAbrir(true),estadoAbrirInicioSesion(false)"><strong>Registrate !</strong></div>
                            <div class="btn btn-outline-info btn-block" @click="recuperarContrasena=true"><strong>Olvido la contraseña?,recuperala!</strong></div>
                            <div class="btn btn-outline-warning btn-block mt-2" @click="estadoAbrirInicioSesion(false), regresar()"><strong><b-icon-arrow-left></b-icon-arrow-left> Regresar</strong></div>
                        </div>
                    </div>
                </form>
            </div>
            <div v-else>
                aca cambiaras la contrasena por una contraseña segura que no olvides!
                <div class="mb-2">
                    <form @submit.prevent="cambiandoContrasena()">
                        <div v-if="espera" class="text-center">
                            <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                            <div class="alert alert-info">Por favor espere</div>
                        </div>
                        <div v-else>
                            <div class="col-md-12">
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
                            <div class="col-md-12">
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
                            <button class="btn btn-outline-warning btn-block" v-if="sonIguales">Cambiar ahora!</button> 
                        </div>   
                    </form>                   
                </div>
            </div>
            <br>
        </b-modal>
        <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="recuperarContrasena">
            <div class="card-body">
                <div class="rounded text-center bg-primary text-white p-4"><h3><strong>Recuperar contraseña</strong></h3></div> 
                <form @submit.prevent="recuperarContrasenaa()">
                    <br>
                    <div v-if="espera" class="text-center">
                        <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                        <div class="alert alert-info">Por favor espere</div>
                    </div>
                    <div v-else>
                        <div>
                            <h5>Codigo de usuario</h5>
                            <input 
                            v-model="recuperar.codigo"
                            type="text"
                            placeholder="Codigo de usuario CC"
                            class="form-control"
                            required/>
                        </div>
                        <h5>Opciones de recuperacion</h5>
                        <div class="tex-center mx-auto">
                            <div class="col-md-12 text-center form-control" >
                                <div class="custom-control custom-switch bg-white text-dark">
                                    <input type="checkbox" class="custom-control-input" id="customSwitch1" @click="recuperar.mail=false" v-model="recuperar.cel">
                                    <label class="custom-control-label" for="customSwitch1" >Recuperar con celular</label>
                                </div>
                            </div>
                            <div class="col-md-12 text-center form-control">                  
                                <div class="custom-control custom-switch bg-white text-dark">
                                    <input type="checkbox" class="custom-control-input bg-info" id="customSwitch2" @click="recuperar.cel=false" v-model="recuperar.mail" >
                                    <label class="custom-control-label" for="customSwitch2" >Recuperar con mail</label>
                                </div>
                            </div>
                        </div>
                        <div v-if="recuperar.cel">
                            Se enviara un mensaje de texto al telefono celular registrado, el cual debera utlizar en el proximo inicio de sesion.
                            <h5>Numero celular</h5>
                            <input 
                            v-model="recuperar.celE"
                            type="number"
                            placeholder="Celular con el cual se a registrado"
                            class="form-control"/>
                        </div>
                        <div v-if="recuperar.mail">
                            Se enviara un EMAIL al correo electronico registrado, el cual debera utlizar en el proximo inicio de sesion.
                            <h5>Mail</h5>
                            <input 
                            v-model="recuperar.mailE"
                            type="mail"
                            placeholder="Mail personal empleado"
                            class="form-control"/>
                        </div>
                        <br>
                        <button class="btn btn-success btn-block mb-2" ><h5><strong>Recuperar contrasena</strong></h5></button>
                    </div>
                </form>
                <div class="btn btn-block btn-danger" @click="cancelarRecuperarContrasena()"><h5><strong>Regresar inicio sesion</strong></h5></div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    computed : {
        ...mapState('storeInicioSesion',['cambiarContrasena','abrirInicioSesion']),
    },
    data(){
        return{
            espera:false,
            options:['Cliente','Ejecutivo','Proveedor','Transportador'],
            usuario:{
                user:'',
                pass:'',
                perfil:'Cliente',
                celular:'',
                sms:false,
                emailC:'',
                email:false
            },
            celularPass:'',
            emailPass:'',
            validarSMS : false,
            validarMAIL : false,
            pass:undefined,
            contaPass:0,
            contaTiempo:{},
            intervalo:{},
            contras: '',
            recuperarContrasena:false,
            ingresar:{
                mail:false,
                cel:false,
            },
            recuperar:{
                mail:false,
                cel:false,
                mailE:null,
                celE:null,
                codigo:null,
            },
            tempo:{},
            otrasManerasInicio:false,
            validarSMSrecuperacion:false,
            cliente:{
                passC:'',
                passC2:'',
                faltando1:false,
                faltando2:false,
                faltando3:false,
                data:{}
            },
            sonIguales:false,
            mirando:false,
            tipo:'password',
        }
    },
    created(){
        this.contras = process.env.SECRET_KEY_TOKEN
    },
    methods:{
        ...mapMutations('storeInicioSesion',['estadoCambiarContrasena','estadoAbrirInicioSesion','estadoRegistroCliente','estadoRegistroAbrir']),
        temporizador(){ 
            this.tiempo = true
            let minutos = 1
            let segundos = 30
            this.intervalo = setInterval(() => {
                segundos=segundos-1
                if(segundos<10){
                    segundos = '0'+ segundos
                }
                this.tempo = {minutos,segundos}
                if(segundos==0){
                    minutos = minutos - 1
                    segundos = 59
                }
                if(minutos==-1){
                    this.cancelarInicio()
                    return
                }
            }, 1000);
        },
        regresar(){
            this.usuario.celular = ''
            this.usuario.emailC = ''
            this.usuario.user = ''
            this.usuario.pass = ''
            this.usuario.email = false
            this.usuario.sms = false
            this.validarSMS = false
            this.tempo = {}
            this.celularPass = ''
            this.emailPass = ''
            this.pass = ''
            this.validarMAIL = false
            this.otrasManerasInicio = false
            this.ingresar.mail= false
            this.ingresar.cel = false
            this.contaPass = 0
        },
        cancelarInicio(){
            clearInterval(this.intervalo)
            this.usuario.celular = ''
            this.usuario.emailC = ''
            this.usuario.email = false
            this.usuario.sms = false
            this.validarSMS = false
            this.tempo = {}
            this.celularPass = ''
            this.emailPass = ''
            this.pass = ''
            this.validarMAIL = false
            this.otrasManerasInicio = false
            this.ingresar.mail= false
            this.ingresar.cel = false
            this.contaPass = 0
        },
        cancelarRecuperarContrasena(){
            this.recuperarContrasena=false
            this.recuperar={
                mail:false,
                cel:false,
                mailE:null,
                celE:null,
                codigo:null,
            }
        },
        async validandoSMS(){
            if (this.celularPass===undefined || this.celularPass===''){
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes escribir el codigo de verificacion enviado al celular registrado!',
                })
                return
            }else{
                this.espera = true
                let SMS = this.CryptoJS.AES.decrypt(this.pass, this.contras).toString(this.CryptoJS.enc.Utf8)
                if(this.celularPass === SMS){
                    this.usuario.sms = true
                    const cliente = await this.$auth.loginWith('cliente', {data:this.usuario})
                    if(cliente.data.success){
                        this.celularPass = ''
                        this.pass = ''
                        this.validarSMS = false
                        this.otrasManerasInicio = false
                        this.usuario.celular = ''
                        this.usuario.sms = false
                        this.ingresar.cel=false
                        this.estadoAbrirInicioSesion(false)
                        this.espera = false
                        this.$router.push("/clientes")
                        let t = new Date()
                        t = t.setMinutes(t.getMinutes()+175)
                        this.$auth.$storage.setUniversal('horaSalida',t)
                    }else{
                        if(cliente.data.status === 202){
                            this.espera = false
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Cliente no existe!',
                            })
                        }
                        if(cliente.data.status===204){
                            this.espera = false
                            this.cliente.data=this.usuario
                            this.estadoCambiarContrasena(true)
                        }
                        if(cliente.data.status === 203){
                            this.espera = false
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Oontraseña erronea!',
                            })
                        }
                    }
                }else{
                    this.contaPass = this.contaPass + 1
                    this.espera = false
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error al ingresar la contraseña!',
                    })
                    if(this.contaPass===2){
                        this.celularPass = ''
                        this.pass = ''
                        this.validarSMS = false
                        this.otrasManerasInicio = false
                        this.usuario.celular = ''
                        this.usuario.sms = false
                        this.ingresar.cel=false
                        clearInterval(this.intervalo)
                        this.contaPass = 0
                        this.espera = false
                    }
                }
            }
        },
        async validandoMAIL(){
            if (this.emailPass===undefined || this.emailPass===''){
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Debes escribir el codigo de verificacion que a sido enviado al email registrado!',
                })
                return
            }else{
                this.espera = true
                let MAIL = this.CryptoJS.AES.decrypt(this.pass, this.contras).toString(this.CryptoJS.enc.Utf8)
                if(this.emailPass === MAIL){
                    this.usuario.email = true
                    const cliente = await this.$auth.loginWith('cliente', {data:this.usuario})
                    if(cliente.data.success){
                        this.emailPass = ''
                        this.pass = ''
                        this.validarMAIL = false
                        this.otrasManerasInicio = false
                        this.usuario.emailC = ''
                        this.usuario.email = false
                        this.ingresar.mail=false
                        this.espera = false
                        this.estadoAbrirInicioSesion(false)
                        this.$router.push("/clientes")
                        let t = new Date()
                        t = t.setMinutes(t.getMinutes()+175)
                        this.$auth.$storage.setUniversal('horaSalida',t)
                    }else{
                        if(cliente.data.status === 202){
                            this.espera = false
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Cliente no existe!',
                            })
                        }
                        if(cliente.data.status===204){
                            this.espera = false
                            this.cliente.data=this.usuario
                            this.estadoCambiarContrasena(true)
                        }
                        if(cliente.data.status === 203){
                            this.espera = false
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',                                
                                text: 'Contraseña erronea!',
                            })
                        }
                    }
                }else{
                    this.contaPass = this.contaPass + 1
                    this.espera = false
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error al ingresar el codigo de verificacion!',
                    })
                    if(this.contaPass===2){
                        this.emailPass = ''
                        this.pass = ''
                        this.validarMAIL = false
                        this.otrasManerasInicio = false
                        this.usuario.emailC = ''
                        this.usuario.email = false
                        this.ingresar.mail=false
                        clearInterval(this.intervalo)
                        this.contaPass = 0
                        this.espera = false
                    }
                }
            }
        },
        async inicioSesion(n){
            this.$auth.$storage.removeUniversal('horaSalida')
            this.$auth.$storage.removeUniversal('carrito')
            if(n==1){
                if( this.usuario.user==''||this.usuario.pass==''||
                    this.usuario.user==undefined||this.usuario.pass==undefined){
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ningun campo debe estar vacio!',
                    })
                    return
                }else{
                    this.espera = true
                    const cliente = await this.$auth.loginWith('cliente', {data:this.usuario})
                    if(cliente.data.success){
                        this.espera = false
                        this.estadoAbrirInicioSesion(false)
                        this.$router.push("/clientes")
                        let t = new Date()
                        t = t.setMinutes(t.getMinutes()+175)
                        this.$auth.$storage.setUniversal('horaSalida',t)
                    }else{
                        if(cliente.data.status===204){
                            this.espera = false
                            this.cliente.data=this.usuario
                            this.estadoCambiarContrasena(true)
                        }
                        if(cliente.data.status === 202){
                            this.espera = false
                             this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Cliente no existe!',
                            })
                        }
                        if(cliente.data.status === 203){
                            this.espera = false
                            if(cliente.data.editado){
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Contraseña erronea, tienes un cambio de contraseña pendiente, recuerda utilizar La contraseña recibida por el medio de recuperacion que escogiste!',
                                })
                            }else{
                                this.espera = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Contraseña erronea!',
                                })
                            }
                        }
                    }
                }
            }
            if(n==2){
                if(this.usuario.celular==''||this.usuario.celular==undefined){
                     this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ningun campo debe estar vacio!',
                    })
                    return
                }else{
                    this.espera = true
                    const client = await this.$axios.$post('/newLogin/SMS',{celular:this.usuario.celular})
                    if(client.success){
                        this.espera = false
                        this.pass = client.pass
                        this.temporizador()
                        this.validarSMS  = true
                    }else{
                        if(client.status===202){
                            this.espera = false
                             this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Cliente no se encuentra registrado'
                            })
                        }
                        if(client.status===204){
                            this.espera = false
                            if(client.conMail){
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Tienes una solicidtud de cambio de contraseña pendiente, porfavor ingresa tu usuario y el codigo de seguridad que se envio a tu correo, y establece una contraseña segura '
                                })
                            }
                            if(client.conCelular){
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Tienes una solicidtud de cambio de contraseña pendiente, porfavor ingresa tu usuario y el codigo de seguridad que se envio a tu celular y establece una contraseña segura '
                                })
                            }
                            this.otrasManerasInicio = false
                            this.usuario.celular = ''
                        }
                    }
                }
            }
            if(n==3){
                if(this.usuario.emailC==''||this.usuario.emailC==undefined){
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ningun campo debe estar vacio!',
                    })
                    return
                }else{
                    this.espera = true
                    const client = await this.$axios.$post('/newLogin/MAIL',{emailC:this.usuario.emailC})
                    if(client.success){
                        this.espera = false
                        this.pass = client.pass
                        this.temporizador()
                        this.validarMAIL = true
                    }else{
                        this.espera = false                        
                        if(client.status===204){
                            if(client.conMail){
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Tienes una solicidtud de cambio de contraseña pendiente, porfavor ingresa tu usuario y el codigo de seguridad que se envio a tu correo, y establece una contraseña segura '
                                })
                            }
                            if(client.conCelular){
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'Tienes una solicidtud de cambio de contraseña pendiente, porfavor ingresa tu usuario y el codigo de seguridad que se envio a tu celular y establece una contraseña segura '
                                })
                            }
                            this.otrasManerasInicio = false
                            this.usuario.emailC = ''
                        }
                        if(client.status===202){
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: client.title+'.!',
                            })
                        }
                    }
                }
            }
        },
        async recuperarContrasenaa() {
            if(this.recuperar.codigo===null || this.recuperar.codigo==''){
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',                                
                    text: 'El codigo es obligatorio!',
                })
                return
            }else{
                if(this.recuperar.cel===false && this.recuperar.mail===false){
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',                                
                        text: 'debes elegir como recuperar tu contraseña!',
                    })
                    return
                }else{
                    if(this.recuperar.cel){
                        this.recuperar.mailE=null
                        if(this.recuperar.celE===null ){
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',                                
                                text: 'el celular es obligatorio!',
                            })
                            return
                        }else{
                            this.espera = true
                            const recuperarOk = await this.recuperarConCel(this.recuperar)
                            if(recuperarOk.data){
                                this.espera = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.cel = false       
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                  
                                    text: 'Se a enviado un mensaje de texto al numero celular '+ this.recuperar.celE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })         
                                this.recuperar.celE = null
                                this.estadoAbrirInicioSesion(true)
                            }else{
                                this.espera = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',                                
                                    text: recuperarOk.title+'.!',
                                })
                            }
                        }
                    }else{
                        if(this.recuperar.mail){
                            this.recuperar.celE=null
                            if(this.recuperar.mailE===null ){
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',                                
                                    text: 'el email es obligatorio.!',
                                })
                                return
                            }else{
                                this.espera = true
                                const recuperarMok = await this.recuperarConMail(this.recuperar)
                                if(recuperarMok.data){
                                    this.espera = false
                                    this.recuperarContrasena = false
                                    this.recuperar.codigo = null
                                    this.recuperar.mail = false
                                    this.$swal.fire({
                                        icon: 'success',
                                        title: 'Ok...',                                
                                        text: 'Se a enviado un email al correo electronico '+ this.recuperar.mailE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                    })
                                    this.recuperar.mailE = null
                                    this.estadoAbrirInicioSesion(true)
                                } else{
                                    this.$swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',                                
                                        text: recuperarMok.title+'.!',
                                    })
                                }             
                            }
                        }            
                    }
                }
            }       
        },
        async recuperarConCel(datos){
            const dataa = await this.$axios.$post('/newLogin/recuperarContrasenaCel', datos)
                if(dataa.success==false){
                    this.espera = false
                    return {data:false,title:dataa.title}
                }else{
                    this.espera = false
                    return {data:true}
                }          
        },
        async recuperarConMail(datos){    
            const dataa = await this.$axios.$post('/newLogin/recuperarContrasenaMail',datos)
            if(dataa.success==false){
                this.espera = false
                return {data:false,title:dataa.title}
            }else{
                this.espera = false
                return {data:true}
            }
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
                    text: 'Primero debes escribir la contraseña en el campo 1.!',
                })
                this.cliente.passC2 = ''
            }else{
                if(this.cliente.passC === this.cliente.passC2){
                    this.sonIguales = true
                }else{
                    this.sonIguales = false
                }
            }
            
        },
        async cambiandoContrasena(){
            this.espera = true
            const data = {
                newPass:this.cliente.passC2,  
            }
            if(this.cliente.data.celular!=''){
                data.celular = this.cliente.data.celular
            }
            if(this.cliente.data.user!=''){
                data.user = this.cliente.data.user
            }
            if(this.cliente.data.emailC!=''){
                data.emailC=this.cliente.data.emailC
            }

            const updateContrasena = await this.$axios.$post('/newLogin/cambiandoPassword',data)
            if(updateContrasena.success){
                this.espera = false
                this.estadoCambiarContrasena(false)
                this.cliente={
                    passC:'',
                    passC2:'',
                    faltando1:false,
                    faltando2:false,
                    faltando3:false,
                    data:{}
                }
                this.$swal.fire({
                    icon: 'success',
                    title: 'Ok...',                                
                    text: 'se a actualizado la contraseña.!',
                })
            }else{
                this.espera = false
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',                                
                    text: 'ocurrio un error en la actualizacion de la contrasena.!',
                })
            }
        },
    },
}
</script>

<style>

</style>