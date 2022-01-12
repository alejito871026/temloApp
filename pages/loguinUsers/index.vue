<template>
    <div id="bacground" style="height:110vh;" v-if="!$auth.loggedIn">
        <div class="p-5 mx-auto text-center" id="buton" >
            <br><br>
            <b-button  variant="white" class="btn-outline-primary" @click="validarRol('Administrativo')"><h2>Administrativo</h2></b-button>&emsp;
            <b-button variant="white" class="btn-outline-primary" @click="validarRol('Proveedor')"><h2>Proveedor</h2></b-button>&emsp;
            <b-button variant="white" class="btn-outline-primary" @click="validarRol('Transportador')"><h2>Transportador</h2></b-button>
        </div>
        <div  class="mx-auto text-center"   style="opacity:0.9" v-if="usuario.rol ">
            <div class="card col-md-8 mx-auto p-2" id="card" >
                <div class="card-header bg-primary text-white">
                    <h3>Inicio de sesion {{this.usuario.rol}}</h3>
                </div>
                <div class="card-body">
                    <div v-if="validarMsn">
                        <form @submit.prevent="validarPass(usuario.rol)">
                            <div v-if="usuario.email">Ingresa el codigo de seguridad que fue enviado a tu email</div>
                            <div v-if="usuario.sms">Ingresa el codigo de seguridad que fue enviado a tu celular como mensaje de texto</div>
                        <div class="col-lg-12" >
                            <h2>Codigo de verificacion</h2>
                            <input v-model="pass" type="text" placeholder="Escribe el pass que a llegado a tu celular" class="form-control"/>
                        </div>
                        <br>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" v-bind:style="n">{{b}} seg</div>
                        </div>
                        <br>
                        <h2>Oportunidades posibles {{2-contaPass}}</h2>
                        <br>
                        <button class="btn btn-warning col-lg-12 " >
                            <h2>Validar pass</h2>
                        </button>
                        <br>
                        <div class="btn btn-success btn-block" @click="regresarInicioSesion()"><h2>Regresar al inicio sesion</h2></div>
                        </form> 
                    </div>
                    <div v-else>
                        <div class="mx-auto" v-if="!recuperarContrasena"> 
                            <div v-if="espera" class="text-center">
                                <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                                <div class="alert alert-info">Por favor espere</div>
                            </div>
                            <form @submit.prevent="inicioSesion()" v-else>                                
                                <div class="p-2">
                                    <span><h3><strong>Usuario</strong></h3></span>
                                    <b-form-input v-model.number="usuario.user" type="number" placeholder="" required></b-form-input>
                                </div>
                                <div class="p-2">
                                    <span><h3><strong>Contraseña</strong></h3></span>
                                    <b-form-input type="password" v-model="usuario.pass" placeholder="contraseña" required></b-form-input>
                                </div>
                                <div class="row">
                                    <b-form-checkbox switch class="col-sm-6" @change="validarSms()" v-model="usuario.sms">Sms</b-form-checkbox>
                                    <b-form-checkbox switch class="col-sm-6" @change="validarEmail()" v-model="usuario.email">Email</b-form-checkbox>
                                </div>
                                <div v-if="usuario.email" class="text-center">
                                    Se enviara un email con el codigo de verificacion para el inicio de sesion seguro
                                </div>
                                <div v-if="usuario.sms" class="text-center">
                                    Se enviara un sms con el codigo de verificacion para el inicio de sesion seguro
                                </div>
                                <div v-if="usuario.rol=='Administrativo' || usuario.rol=='Proveedor'" class="p-2">
                                    <span><h3><strong>Nit empresa</strong></h3></span>
                                    <b-form-input v-model="usuario.nitEmpresa" placeholder="" ></b-form-input>
                                </div>
                                <div v-if="usuario.rol=='Transportador'" class="p-2">
                                    <span><h3><strong>Placa vehiculo</strong></h3></span>
                                    <b-form-input v-model="usuario.placasVehiculo" placeholder="" ></b-form-input>
                                </div>
                                <button class="btn btn-primary btn-block"><h3><strong>Ingresar</strong></h3></button>
                            </form>                            
                        </div>
                        <div class="mt-2 btn btn-success btn-block text-white" @click="recuperarContrasena=true"><h3><strong>Olvido contraseña?</strong></h3></div>
                        <br>
                    </div>
                </div>
                <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="recuperarContrasena">
                    <div class="card-body">
                        <div class="rounded text-center bg-primary text-white p-4"><h3><strong>Recuperar contraseña</strong></h3></div> 
                        <form @submit.prevent="recuperarContrasenaa()">
                            <br>
                            <div v-if="espera2" class="text-center">
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
                                    class="form-control"/>
                                </div>
                                <div v-if="usuario.rol=='Administrativo'|| usuario.rol=='Proveedor'">
                                    <h5>Nit de la empresa</h5>
                                    <input 
                                    v-model="recuperar.nitEmpresa"
                                    type="text"
                                    placeholder="NIT de la empresa"
                                    class="form-control"/>
                                </div>
                                <div v-if="usuario.rol=='Transportador'">
                                    <h5>Placas del vehiculo</h5>
                                    <input 
                                    v-model="recuperar.placas"
                                    type="text"
                                    placeholder="NIT de la empresa"
                                    class="form-control"/>
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
                <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="recuperandoContrasena">
                    <div class="card-body">
                        <div class="rounded text-center bg-primary text-white p-4"><h3><strong> 
                            Señor {{cliente.usuario}} aca cambiaras la contrasena por una contraseña segura que no olvides!
                        </strong></h3></div>
                        <div class="mb-2">
                            <form @submit.prevent="cambiandoContrasena(usuario.rol)">
                                <div v-if="espera3" class="text-center">
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
                        <div class="btn btn-block btn-danger" @click="cancelarRecuperandoContrasena()"><h5><strong>Regresar inicio sesion</strong></h5></div>
                    </div>
                </b-modal>
            </div>            
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    props:['nn'],
    computed:{
    },
    data(){
        return{          
            espera:false,  
            espera2:false,  
            espera3:false,  
            usuario:{
                email:false,
                sms:true,
                rol:'',
            },   
            recuperarContrasena:false,
            recuperar:{
                rol:'',
                nitEmpresa:null,
                mail:false,
                cel:false,
                mailE:null,
                celE:null,
                codigo:null,
                placas:null
            },
            recuperandoContrasena:false,
            cliente:{
                usuario:'',
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
            coded:'',
            rol:'',
            validarMsn : false,
            pass:undefined,
            contaPass:0,
            b:60,
            n:{},
            intervalo:{},
            contras: '',
            
        }
    }, 
    async mounted() {
      this.validandoLoguin()
    },
    created(){
        this.contras = process.env.SECRET_KEY_TOKEN
    },
    methods:{
        ...mapMutations('storeInicioSesion',['estadoCambiarContrasena',]),
        validandoLoguin(){
            if(!this.$auth.$state.loggedIn){
                console.log('no estas connectada')
            }else{
                if(this.$auth.user.rol=='SUPERADMIN'||this.$auth.user.rol=='ADMIN'){
                    this.$router.push("/adminTemlo")
                }
                if(this.$auth.user.rol=='Ejecutivo'){
                    this.$router.push("/EjecutivoTemlo")
                }
                if(this.$auth.user.rol=='SUPERADMINPROVEEDOR'||this.$auth.user.rol=='ADMINPROVEEDOR'){
                    this.$router.push("/AdminProveedores")
                }
                if(this.$auth.user.rol=='EjecutivoProveedor'){
                    this.$router.push("/EjecutivoProveedor")
                }
                if(this.$auth.user.rol=='transportador'){
                    this.$router.push("/transportadores")
                } 
                if(this.$auth.user.rol=='Cliente'){
                    this.$router.push("/clientes")
                }               
            } 
        },
        validarRol(rol){
            this.usuario.rol = ''
            this.usuario.rol = rol
        },
        validarEmail(){
            if(this.usuario.email==true){
                this.usuario.sms = false
            }
        },
        validarSms(){
            if(this.usuario.sms==true){
                this.usuario.email = false
            }
        },
        async recuperarContrasenaa() {
            this.recuperar.rol = this.usuario.rol
            if(this.recuperar.codigo===null || this.recuperar.codigo==''){
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',                                
                    text: 'El codigo es obligatorio!',
                })
                return
            }
            if(this.recuperar.rol=="Administrativo"){
                this.recuperar.placas = null
                if(this.recuperar.nitEmpresa===null || this.recuperar.nitEmpresa==''){
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',                                
                        text: 'El nit de la empresa es obligatorio!',
                    })
                    return
                }else if(this.recuperar.cel===false && this.recuperar.mail===false){
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
                            this.espera2 = true
                            const recuperarOk = await this.recuperarConCel(this.recuperar,1)
                            console.log(recuperarOk)
                            if(recuperarOk.data){
                                this.espera2 = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.nitEmpresa = null
                                this.recuperar.rol = ''
                                this.recuperar.cel = false       
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                  
                                    text: 'Se a enviado un mensaje de texto al numero celular '+ this.recuperar.celE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })         
                                this.recuperar.celE = null
                            }else{
                                this.espera2 = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Error: '+recuperarOk.status,                                
                                    text: recuperarOk.title+'.!',
                                })
                            }
                        }
                    }else if(this.recuperar.mail){
                        this.recuperar.celE=null
                        if(this.recuperar.mailE===null ){
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',                                
                                text: 'el email es obligatorio.!',
                            })
                            return
                        }else{
                            this.espera2 = true
                            const recuperarMok = await this.recuperarConMail(this.recuperar,1)
                            console.log(recuperarMok)
                            if(recuperarMok.data){
                                this.espera2 = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.nitEmpresa = null
                                this.recuperar.rol = ''
                                this.recuperar.mail = false
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                
                                    text: 'Se a enviado un email al correo electronico '+ this.recuperar.mailE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })
                                this.recuperar.mailE = null
                            } else{
                                this.espera2 = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Error: '+recuperarMok.status,                               
                                    text: recuperarMok.title+'.!',
                                })
                            }             
                        }
                    }                     
                }
            } 
            if(this.recuperar.rol=="Proveedor"){
                console.log('viene bien')
                this.recuperar.placas = null
                if(this.recuperar.nitEmpresa===null || this.recuperar.nitEmpresa==''){
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',                                
                        text: 'El nit de la empresa es obligatorio!',
                    })
                    return
                }else if(this.recuperar.cel===false && this.recuperar.mail===false){
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
                            this.espera2 = true
                            const recuperarOk = await this.recuperarConCel(this.recuperar,2)
                            console.log(recuperarOk)
                            if(recuperarOk.data){
                                this.espera2 = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.nitEmpresa = null
                                this.recuperar.rol = ''
                                this.recuperar.cel = false       
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                  
                                    text: 'Se a enviado un mensaje de texto al numero celular '+ this.recuperar.celE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })         
                                this.recuperar.celE = null
                            }else{
                                this.espera2 = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Error: '+recuperarOk.status,                                
                                    text: recuperarOk.title+'.!',
                                })
                            }
                        }
                    }else if(this.recuperar.mail){
                        this.recuperar.celE=null
                        if(this.recuperar.mailE===null ){
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',                                
                                text: 'el email es obligatorio.!',
                            })
                            return
                        }else{
                            this.espera2 = true
                            const recuperarMok = await this.recuperarConMail(this.recuperar,2)
                            console.log(recuperarMok)
                            if(recuperarMok.data){
                                this.espera2 = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.nitEmpresa = null
                                this.recuperar.rol = ''
                                this.recuperar.mail = false
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                
                                    text: 'Se a enviado un email al correo electronico '+ this.recuperar.mailE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })
                                this.recuperar.mailE = null
                            } else{
                                this.espera2 = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Error: '+recuperarMok.status,                               
                                    text: recuperarMok.title+'.!',
                                })
                            }             
                        }
                    }                     
                }
            } 
            if(this.recuperar.rol=="Transportador"){
                this.recuperar.nitEmpresa = null
                if(this.recuperar.placas===null || this.recuperar.placas==''){
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',                                
                        text: 'El nit de la empresa es obligatorio!',
                    })
                    return
                }else if(this.recuperar.cel===false && this.recuperar.mail===false){
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
                            this.espera2 = true
                            const recuperarOk = await this.recuperarConCel(this.recuperar,3)
                            console.log(recuperarOk)
                            if(recuperarOk.data){
                                this.espera2 = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.rol = ''
                                this.recuperar.cel = false 
                                this.recuperar.placas = null
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                  
                                    text: 'Se a enviado un mensaje de texto al numero celular '+ this.recuperar.celE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })         
                                this.recuperar.celE = null
                            }else{
                                this.espera2 = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Error: '+recuperarOk.status,                                
                                    text: recuperarOk.title+'.!',
                                })
                            }
                        }
                    }else if(this.recuperar.mail){
                        this.recuperar.celE=null
                        if(this.recuperar.mailE===null ){
                            this.$swal.fire({
                                icon: 'error',
                                title: 'Oops...',                                
                                text: 'el email es obligatorio.!',
                            })
                            return
                        }else{
                            this.espera2 = true
                            const recuperarMok = await this.recuperarConMail(this.recuperar,3)
                            console.log(recuperarMok)
                            if(recuperarMok.data){
                                this.espera2 = false
                                this.recuperarContrasena = false
                                this.recuperar.codigo = null
                                this.recuperar.placas = null
                                this.recuperar.rol = ''
                                this.recuperar.mail = false
                                this.$swal.fire({
                                    icon: 'success',
                                    title: 'Ok...',                                
                                    text: 'Se a enviado un email al correo electronico '+ this.recuperar.mailE +' con el codigo seguro de inicio de sesion para el cambio de contraseña.!',
                                })
                                this.recuperar.mailE = null
                            } else{
                                console.log()
                                this.espera2 = false
                                this.$swal.fire({
                                    icon: 'error',
                                    title: 'Error: '+recuperarMok.status,                               
                                    text: recuperarMok.title+'.!',
                                })
                            }             
                        }
                    }                     
                }
            }      
        },
        async recuperarConCel(datos,n){
            if (n==1) {
                const dataa = await this.$axios.$post('/newLoginAdmintemlo/recuperarContrasenaCel', datos)
                console.log(dataa)
                if(dataa.success==false){
                    return {data:false,title:dataa.title,status:dataa.status}
                }else{
                    return {data:true}
                } 
            }  
            if (n==2) {
                const dataa = await this.$axios.$post('/newLoginProveedor/recuperarContrasenaCel', datos)
                if(dataa.success==false){
                    return {data:false,title:dataa.title,status:dataa.status}
                }else{
                    return {data:true}
                } 
            } 
            if (n==3) {
                const dataa = await this.$axios.$post('/newLoginTransportador/recuperarContrasenaCel', datos)
                if(dataa.success==false){
                    return {data:false,title:dataa.title,status:dataa.status}
                }else{
                    return {data:true}
                } 
            }         
        },
        async recuperarConMail(datos,n){  
            console.log(datos) 
            console.log(n) 
            if (n==1) {
                const dataa = await this.$axios.$post('/newLoginAdmintemlo/recuperarContrasenaMail', datos)
                console.log(dataa)
                if(dataa.success==false){
                    return {data:false,title:dataa.title,status:dataa.status}
                }else{
                    return {data:true}
                } 
            }  
            if (n==2) {
                const dataa = await this.$axios.$post('/newLoginProveedor/recuperarContrasenaMail', datos)
                if(dataa.success==false){
                    return {data:false,title:dataa.title,status:dataa.status}
                }else{
                    return {data:true}
                } 
            } 
            if (n==3) {
                const dataa = await this.$axios.$post('/newLoginTransportador/recuperarContrasenaMail', datos)
                if(dataa.success==false){
                    return {data:false,title:dataa.title,status:dataa.status}
                }else{
                    return {data:true}
                } 
            }  
        },
        cancelarRecuperarContrasena(){
            this.recuperarContrasena=false
            this.recuperar={
                mail:false,
                cel:false,
                mailE:null,
                celE:null,
                codigo:null,
                rol:'',
                nitEmpresa:null,
                placas : null,
            }
        },
        async inicioSesion(){
            this.espera = true
            if(this.usuario.rol=="Administrativo"){
                if(this.usuario.user==''||this.usuario.user==undefined||
                this.usuario.pass==''||this.usuario.pass==undefined){
                    this.$swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:'Ningun campo debe estar vacio'
                    })
                    this.espera = false
                    return                    
                }else if(this.usuario.email==false && this.usuario.sms == false){
                    this.$swal.fire({
                        icon:'info',
                        title:'Vamos!',
                        text:'Escoge un metodo de verificacion SMS o EMAIL'
                    })
                    this.espera = false
                    return
                }else if(this.usuario.nitEmpresa==''||this.usuario.nitEmpresa==undefined){
                    this.$swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:'Escribe el nit de la empresa'
                    }) 
                    this.espera = false
                    return
                }else{
                    let r = await this.$axios.$post('/newLoginAdmintemlo/iniSesion',this.usuario)
                    this.espera = false
                    if (r.status===204){
                        this.$swal.fire({
                            icon:'error',
                            title:'Oops...',
                            text:'El nit ingresado no pertenece al empleado registrado'
                        }) 
                        return                        
                    }
                    if (r.status===203){
                        if(r.editado){
                            this.$swal.fire({
                                icon:'error',
                                title:'Oops...',
                                text:'Tienes pendiente el cambio de contraseña revisa tu ' + r.conQ + ' e ingresa el codigo de inicio unico que te a sido enviado en la casilla de contraseña'
                            }) 
                            return
                        }else{
                            this.$swal.fire({
                                icon:'error',
                                title:'Oops...',
                                text:'Error en la contraseña'
                            }) 
                            return
                        }
                    }
                    if (r.status===202){
                        this.$swal.fire({
                            icon:'error',
                            title:'Error: '+r.status,
                            text:'Usuario no existe, cedula no registrada'
                        }) 
                        return
                    }
                    if(r.status===201){
                        this.$swal.fire({
                            icon:'success',
                            title: 'En horabuena!?', 
                            text:'Recuerda cambiar tu contraseña periodicamente',                           
                            showDenyButton: true,
                            confirmButtonText: 'Cambiar contraseña',
                            denyButtonText: 'Regresar',
                            }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                this.cliente.usuario = r.usuario
                                this.recuperandoContrasena = true 
                            } else if (result.isDenied) {
                                this.$swal.fire({
                                    icon:'info',
                                    title:'Recuerda...',
                                    text:'Deberas cambiarla en tu proximo ingreso',
                                    timer: 3000,
                                    showConfirmButton: false,
                                })
                            }
                        })              
                    }
                    if (r.status===200){
                        this.estadoBarraPass() 
                        this.coded = r.coded
                        this.rol = r.rol
                        this.validarMsn = true
                    }
                }
            }

            if(this.usuario.rol=="Proveedor"){
                if(this.usuario.user==''||this.usuario.user==undefined||
                this.usuario.pass==''||this.usuario.pass==undefined){
                    this.$swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:'Ningun campo debe estar vacio'
                    })
                    this.espera = false
                    return
                }else if(this.usuario.email==false && this.usuario.sms == false){
                    this.$swal.fire({
                        icon:'info',
                        title:'Vamos!',
                        text:'Escoge un metodo de verificacion SMS o EMAIL'
                    })
                    this.espera = false
                    return
                }else if(this.usuario.nitEmpresa==''||this.usuario.nitEmpresa==undefined){
                    this.$swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:'Escribe el nit de la empresa'
                    }) 
                    this.espera = false
                    return
                }else{
                    let r = await this.$axios.$post('/newLoginProveedor/iniSesion',this.usuario)
                    this.espera = false
                    if (r.status===204){
                        this.$swal.fire({
                            icon:'error',
                            title:'Oops...',
                            text:'El nit ingresado no pertenece al empleado registrado'
                        }) 
                        return                        
                    }
                    if (r.status===203){
                        if(r.editado){
                            this.$swal.fire({
                                icon:'error',
                                title:'Oops...',
                                text:'Tienes pendiente el cambio de contraseña revisa tu ' + r.conQ + ' e ingresa el codigo de inicio unico que te a sido enviado en la casilla de contraseña'
                            }) 
                            return
                        }else{
                            this.$swal.fire({
                                icon:'error',
                                title:'Oops...',
                                text:'Error en la contraseña'
                            }) 
                            return
                        }
                    }
                    if (r.status===202){
                        this.$swal.fire({
                            icon:'error',
                            title:'Error: '+r.status,
                            text:'Usuario no existe, cedula no registrada'
                        }) 
                        return
                    }
                    if(r.status===201){
                        this.$swal.fire({
                            icon:'success',
                            title: 'En horabuena!?', 
                            text:'Recuerda cambiar tu contraseña periodicamente',                           
                            showDenyButton: true,
                            confirmButtonText: 'Cambiar contraseña',
                            denyButtonText: 'Regresar',
                            }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                this.cliente.usuario = r.usuario
                                this.recuperandoContrasena = true 
                            } else if (result.isDenied) {
                                this.$swal.fire({
                                    icon:'info',
                                    title:'Recuerda...',
                                    text:'Deberas cambiarla en tu proximo ingreso',
                                    timer: 3000,
                                    showConfirmButton: false,
                                })
                            }
                        })              
                    }
                    if (r.status===200){
                        this.estadoBarraPass() 
                        this.coded = r.coded
                        this.rol = r.rol
                        this.validarMsn = true
                    }
                }
            }

            if(this.usuario.rol=="Transportador"){
                console.log('es transportador')
                if(this.usuario.placasVehiculo==''||this.usuario.placasVehiculo==undefined){
                    this.$swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:'escribe la placa del vehiculo'
                    }) 
                    return
                }
            }            
        },
        recuperarPass(){
            this.recuperarContrasena = true
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
        async cambiandoContrasena(rol){
            console.log(rol)
            this.espera3 = true
            const data = {
                newPass:this.cliente.passC2,  
                user:this.usuario.user
            }
            if(rol=='Administrativo'){
                const updateContrasena = await this.$axios.$post('/newLoginAdmintemlo/cambiandoPassword',data)
                if(updateContrasena.success){
                    this.espera3 = false
                    this.recuperandoContrasena=false
                    this.cliente={
                        passC:'',
                        passC2:'',
                        faltando1:false,
                        faltando2:false,
                        faltando3:false,
                    }
                    this.$swal.fire({
                        icon: 'success',
                        title: 'Ok...',                                
                        text: 'se a actualizado la contraseña.!',
                        timer: 3000,
                        showConfirmButton: false,
                    })
                }else{
                    this.espera3 = false
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',                                
                        text: 'ocurrio un error en la actualizacion de la contrasena.!',
                        timer: 3000,
                        showConfirmButton: false,
                    })
                }
            }
            if(rol=='Proveedor'){
                const updateContrasena = await this.$axios.$post('/newLoginProveedor/cambiandoPassword',data)
                if(updateContrasena.success){
                    this.espera3 = false
                    this.recuperandoContrasena=false
                    this.cliente={
                        passC:'',
                        passC2:'',
                        faltando1:false,
                        faltando2:false,
                        faltando3:false,
                    }
                    this.$swal.fire({
                        icon: 'success',
                        title: 'Ok...',                                
                        text: 'se a actualizado la contraseña.!',
                        timer: 3000,
                        showConfirmButton: false,
                    })
                }else{
                    this.espera3 = false
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',                                
                        text: 'ocurrio un error en la actualizacion de la contrasena.!',
                        timer: 3000,
                        showConfirmButton: false,
                    })
                }
            }
        }, 
        cancelarRecuperandoContrasena(){
            this.recuperandoContrasena = false,
            this.cliente={
                passC:'',
                passC2:'',
                faltando1:false, 
                faltando2:false,
                faltando3:false,
            }
        },
        estadoBarraPass(){
            this.b=60
            let w = 100
            this.validarMsn = true  
            this.intervalo = setInterval(() => {     
            this.n = {
                height: '20px',
                width: w+"%",
                valuemin:"0",
                valuemax:"100",
            }
          this.b-=1
          w-=1.67
          if (this.b===0) {
              this.validarMsn = false
              this.pass = undefined 
              alert ('se agoto el tiempo')
              this.$auth.logout()
              clearInterval(this.intervalo)
            }
          }, 1000);
        },
        async validarPass(rol){ 
            if (this.pass===undefined || this.pass===''){
                this.$swal.fire({
                    icon:'info',
                    title:'Recuerda...',
                    text:'debees escribir el codigo para validarlo',
                    timer: 3000,
                    showConfirmButton: false,
                })
                return
            }else{
                let sms = this.CryptoJS.AES.decrypt(this.coded, this.contras).toString(this.CryptoJS.enc.Utf8)
                console.log(sms)
                if(sms === this.pass){  
                    if(rol=='Administrativo'){
                        clearInterval(this.intervalo)
                        this.pass = null 
                        if(this.rol=='SUPERADMIN'||this.rol == 'ADMIN'){
                            const logOk = await this.$auth.loginWith('adminTemlo',{data:this.usuario})   
                            if(logOk.data.success){
                                this.validarMsn = false
                                this.$router.push("/adminTemlo")
                                let t = new Date()
                                t = t.setMinutes(t.getMinutes()+175)
                                this.$auth.$storage.setUniversal('horaSalidaAdminTemlo',t)
                            }                       
                        }
                        if(this.rol=='Ejecutivo'){
                            const logOk = await this.$auth.loginWith('adminTemlo',{data:this.usuario})   
                            if(logOk.data.success){
                                this.validarMsn = false
                                this.$router.push("/EjecutivoTemlo");
                                let t = new Date()
                                t = t.setMinutes(t.getMinutes()+175)
                                this.$auth.$storage.setUniversal('horaSalidaEjecutivoTemlo',t)
                            }  
                        }         
                    }
                    if(rol=='Proveedor'){
                        if(this.rol=='SUPERADMINPROVEEDOR'||this.rol == 'ADMINPROVEEDOR'){
                            clearInterval(this.intervalo)
                            this.pass = null 
                            const logOk = await this.$auth.loginWith('proveedores',{data:this.usuario})   
                            if(logOk.data.success){
                                this.validarMsn = false
                                this.$router.push("/AdminProveedores")
                                let t = new Date()
                                t = t.setMinutes(t.getMinutes()+175)
                                this.$auth.$storage.setUniversal('horaSalidaAdminProveedor',t)
                            }                          
                        }
                        if(this.rol=='EjecutivoProveedor'){
                            clearInterval(this.intervalo)
                            this.pass = null 
                            const logOk = await this.$auth.loginWith('proveedores',{data:this.usuario})   
                            if(logOk.data.success){
                                this.validarMsn = false
                                this.$router.push("/EjecutivoProveedor");
                                let t = new Date()
                                t = t.setMinutes(t.getMinutes()+175)
                                this.$auth.$storage.setUniversal('horaSalidaEjecutivoProveedor',t)
                            }                              
                        }
                    }
                    if(rol=='Transportador'){
                        if(this.rol ==='TRANSPORTADOR'){
                            await this.$auth.loginWith('local',{data:user})
                            await this.$auth.setUser(user)
                            this.$router.push("/Transportador");
                        }
                    }
                } else {
                    this.contaPass+=1
                    if (this.contaPass===1) {
                        alert('escribiste un pass incorrecto, te queda una oportunidad')
                    }
                    if(this.contaPass===2){ 
                        this.pass = undefined           
                        clearInterval(this.intervalo)
                        this.validarMsn = false
                        alert('agotaste las oportunidades')           
                        this.$auth.logout()
                        this.contaPass=0
                    } 
                }
            }
        },
        regresarInicioSesion(){
            this.coded=null,
            this.rol='',
            this.validarMsn = false,
            clearInterval(this.intervalo)
            this.pass = null 
        },
    }   
}
</script>

<style>
    #bacground {
        background-image: url('../../static/dos.jpg');
        background-size: cover;
    }
    #login {
        opacity:0.5; 
    }
    #card{
        font-weight: bold;
        color: #000000;
    }
    #buton {
        padding: 400px;
        font-weight: bold;
    }
</style>