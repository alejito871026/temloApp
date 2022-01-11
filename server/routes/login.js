const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const empleadoTemlo = require('../models/empleadoTemlo.js');
const empleadoProveedor = require('../models/empleadosProveedores.js');
const Cliente = require('../models/cliente.js')
const cryptos = require('crypto')
const crypto = require('crypto-js')
const contras = process.env.SECRET_KEY_TOKEN
const config = {
    authSecret : process.env.SECRET_KEY_TOKEN
}
router.get('/usuario',async (req, res)=>{
    var token = req.headers.authorization
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret,async (err, decoded)=>{
            if (err) {
                console.log('err')
                console.log(err)
                return res.status(401).json({
                    success: false,
                    message: 'unauthorized'
                })
            }
            if(decoded) {                
                let ress = {}
                const _id=decoded._id
                let userr= await empleadoTemlo.findOne({'_id':_id}).populate('empresa')
                ress.rol = userr.rol
                ress.nombreE = userr.nombreE
                ress.primerApellidoE = userr.primerApellidoE
                ress.segundoApellidoE = userr.segundoApellidoE
                ress._id = userr._id
                ress.nitEmpresa = userr.empresa[0].nit
                ress.empresa = userr.empresa[0]._id
                res.json({user:ress})                
            }
        });
    }
    else{
        console.log('errrrrrr')
        console.log(err)
        return res.status(401).json({message: 'unauthorized'})
    }
})
router.get('/clientee',async (req, res)=>{
    var token = req.headers.authorization
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret,async (err, decoded)=>{
            if (err) {
                return res.status(401).json({
                success: false,
                message: 'unauthorized'
                })
            }
            if(decoded) {            
                let ress = {}
                const _id=decoded._id
                let userr= await Cliente.findOne({'_id':_id})
                ress.nombreE = userr.nombreCompletoC 
                ress._id = userr._id
                res.json({user:ress})                
            }
        });
    }
    else{
        return res.status(401).json({message: 'unauthorized'})
    }
})
router.get('/usuarioProveedor',async (req, res)=>{
    var token = req.headers.authorization
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret,async (err, decoded)=>{
            if (err) {
                return res.status(401).json({
                success: false,
                message: 'unauthorized'
                })
            }
            if(decoded) {
                
                let ress = {}
                const _id=decoded._id
                let userr= await empleadoProveedor.findOne({'_id':_id}).populate('empresaProveedoraEP')
                ress.rol = userr.rol
                ress.nombreE = userr.nombreEP
                ress.primerApellidoE = userr.primerApellidoEP
                ress.segundoApellidoE = userr.segundoApellidoEP
                ress._id = userr._id
                ress.nitEmpresa = userr.empresaProveedoraEP.nitProveedor
                ress.empresa = userr.empresaProveedoraEP._id
                res.json({user:ress})                
            }
        });
    }
    else{
        return res.status(401).json({message: 'unauthorized'})
    }
})

router.post('/iniSesion', async( req, res)=>{
    if(req.body.perfil === 'Proveedor'){
        const empleadoP = await empleadoProveedor.findOne({cedulaEP:req.body.user}).populate('empresaProveedoraEP')
        try {
            if (!empleadoP){
                return res.json({
                    title: 'usuario no existe',
                    error: ' cedula no registrada',
                    success:false,
                    status:202
                });
            }else if (!empleadoP.compararContrasena(req.body.pass)){
                return res.json({
                    title: 'Error en Contrasena',
                    error: 'Contrasena Erronea',
                    success:false,
                    status:203,
                });
            }else  if(empleadoP.empresaProveedoraEP.nitProveedor!=req.body.nitEmpresa){
                return res.json({
                    title: 'Error en nit',
                    error: 'Nit erroneo',
                    success:false,
                    status:204,
                });
            }else if(empleadoP.activo==true){
                //falta validar si es super user o admin o q o verificar si no es necesario esa pregunta    
                if(empleadoP.editadoEP==false){
                    let usuario = {
                        nombre:empleadoP.nombreEP +' '+ empleadoP.primerApellidoEP +' '+ empleadoP.primerApellidoEP,
                        codigo:empleadoP.cedulaEP,
                        celular:empleadoP.celularEP,
                        rol:empleadoP.rol,
                        coded:'',
                        _id:empleadoP._id
                    }
                    let mensaje =  await cargarPass(usuario,1)
                    console.log(mensaje)
                    if(mensaje.valid ===true){
                        usuario.coded = crypto.AES.encrypt(mensaje.pass, contras).toString()
                        
                        return res.json({ 
                            status:200,
                            user:usuario,
                        })
                    }
                    if(mensaje.valid===false){
                        if(mensaje.cod === 101){
                            return res.json({ 
                                status:101,
                                succes:false,
                                error:'numero de telefono invalido'
                            })
                        }
                        //en caso de que se presenten mas errores aca los podremos empezar a listar
                    }    
                }else{
                    const usuario = {
                        nombre:empleadoP.nombreEP +' '+ empleadoP.primerApellidoEP +' '+ empleadoP.primerApellidoEP,
                        codigo:empleadoP.cedulaEP,
                        celular:empleadoP.celularEP,
                        rol:empleadoP.rol,
                        _id:empleadoP._id
                    }
                    const payload = {
                        _id:empleadoP._id,
                        user:usuario
                    }
                        token = jwt.sign(payload,config.authSecret,{
                        expiresIn: 60 * 60 * 24 / 6
                    })
                    res.json({ 
                        success:true,
                        token,
                        usuario,
                        status:201
                    })
                } 
            }else{
                res.json({ 
                    success:false,
                    status:409,
                    error:'empleado inactivo'
                })
            }
        } catch (err) {
            return res.json({
                title: 'error en el servidor',
                error:err,
                status:500
            }) 
        }
    }
    if(req.body.perfil === 'Administrativo'){
        const empleadoTem = await empleadoTemlo.findOne({cedulaE:req.body.user}).populate('empresa')
        try {
            if (!empleadoTem){
                return res.json({
                    title: 'usuario no existe',
                    error: ' cedula no registrada',
                    success:false,
                    status:202
                });
            }else if (!empleadoTem.compararContrasena(req.body.pass)){
                return res.json({
                    title: 'Error en Contrasena',
                    error: 'Contrasena Erronea',
                    success:false,
                    status:203,
                });
            }else  if(empleadoTem.empresa[0].nit!=req.body.nitEmpresa){
                return res.json({
                    title: 'Error en nit',
                    error: 'Nit erroneo',
                    success:false,
                    status:204,
                });
            }else if(empleadoTem.activo==true){
                //falta validar si es super user o admin o q o verificar si no es necesario esa pregunta    
                if(empleadoTem.editado==false){
                    let usuario = {
                        nombre:empleadoTem.nombreE +' '+ empleadoTem.primerApellidoE +' '+ empleadoTem.primerApellidoE,
                        codigo:empleadoTem.cedulaE,
                        celular:empleadoTem.celularE,
                        rol:empleadoTem.rol,
                        coded:'',
                        _id:empleadoTem._id
                    }
                    let mensaje =  await cargarPass(usuario,1)
                    console.log(mensaje)
                    if(mensaje.valid ===true){
                        usuario.coded = crypto.AES.encrypt(mensaje.pass, contras).toString()
                        
                        return res.json({ 
                            status:200,
                            user:usuario,
                        })
                    }
                    if(mensaje.valid===false){
                        if(mensaje.cod === 101){
                            return res.json({ 
                                status:101,
                                succes:false,
                                error:'numero de telefono invalido'
                            })
                        }
                        //en caso de que se presenten mas errores aca los podremos empezar a listar
                    }    
                }else{
                    const usuario = {
                        nombre:empleadoTem.nombreE +' '+ empleadoTem.primerApellidoE +' '+ empleadoTem.segundoApellidoE,
                        codigo:empleadoTem.cedulaE,
                        celular:empleadoTem.celularE,
                        rol:empleadoTem.rol,
                        _id:empleadoTem._id
                    }
                    const payload = {
                        _id:empleadoTem._id,
                        user:usuario
                    }
                        token = jwt.sign(payload,config.authSecret,{
                        expiresIn: 60 * 60 * 24 / 6
                    })
                    res.json({ 
                        success:true,
                        token,
                        usuario,
                        status:201
                    })
                } 
            }else{
                res.json({ 
                    success:false,
                    status:409,
                    error:'empleado inactivo'
                })
            }
        } catch (err) {
            return res.json({
                title: 'error en el servidor',
                error:err,
                status:500
            }) 
        }  
    }
    if(req.body.perfil === 'Cliente'){
        const cliente = await Cliente.findOne({cedulaC:req.body.user})
        const cliente1 = await Cliente.findOne({emailC:req.body.user})
        const cliente2 = await Cliente.findOne({celularC:req.body.user})
        if(cliente){
            if (!cliente.compararContrasena(req.body.pass)){
                res.json({
                    title: 'Error en Contrasena',
                    error: 'Contrasena Erronea',
                    success:false,
                    status:203,
                })
            }else {
                const usuario = {
                    nombre:cliente.nombreCompletoC,
                    cedula:cliente.cedulaC,
                    celular:cliente.celularC,
                    _id:cliente._id
                }
                const payload = {
                    _id:cliente._id,
                    user:usuario
                }
                    token = jwt.sign(payload,config.authSecret,{
                    expiresIn: 60 * 60 * 24 / 6
                })
                res.json({ 
                    success:true,
                    token,
                    usuario,
                    status:200
                })
            }        
        }else if(cliente1){
            if (!cliente1.compararContrasena(req.body.pass)){
                res.json({
                    title: 'Error en Contrasena',
                    error: 'Contrasena Erronea',
                    success:false,
                    status:203,
                })
            }else {
                const usuario = {
                    nombre:cliente1.nombreCompletoC,
                    cedula:cliente1.cedulaC,
                    celular:cliente1.celularC,
                    rol:'Cliente',
                    _id:cliente1._id
                }
                const payload = {
                    _id:cliente1._id,
                    user:usuario
                }
                    token = jwt.sign(payload,config.authSecret,{
                    expiresIn: 60 * 60 * 24 / 6
                })
                res.json({ 
                    success:true,
                    token,
                    usuario,
                    status:200
                })
            }    
        }else if(cliente2){
            if (!cliente2.compararContrasena(req.body.pass)){
                res.json({
                    title: 'Error en Contrasena',
                    error: 'Contrasena Erronea',
                    success:false,
                    status:203,
                })
            }else {
                const usuario = {
                    nombre:cliente2.nombreCompletoC,
                    cedula:cliente2.cedulaC,
                    celular:cliente2.celularC,
                    rol:'Cliente',
                    _id:cliente2._id
                }
                const payload = {
                    _id:cliente2._id,
                    user:usuario
                }
                    token = jwt.sign(payload,config.authSecret,{
                    expiresIn: 60 * 60 * 24 / 6
                })
                res.json({ 
                    success:true,
                    token,
                    usuario,
                    status:200
                })
            }
        }else{
            res.json({
                title: 'usuario no existe',
                success:false,
                status:202
            })
        }
    }
});
router.post('/login', async (req, res)=>{   
    const payload = {
        _id:req.body._id, 
    }
    const token = jwt.sign(payload,config.authSecret,{
        expiresIn: 60 * 60 * 24 / 6
    })
    res.json({token})
});
router.post('/recuperarContrasenaCel', async (req, res)=>{  
    empleadoTemlo.findOne({cedulaE:req.body.codigo},(err, user)=> {
        if(err){
            return res.status(500).json({
                title: 'error en el servidor',
                error:err,
            })                 
        }
        if (!user){
            return res.json({
                title: 'usuario no existe',
                error: ' cedula no registrada',
                status:202,
                success:false 
            });
        }else if(user.celularE!=req.body.celular){
            return res.json({
                title: 'error en el telefono',
                status:203,
                error: ' ingresaste un telefono erroneo',
                success:false 
            });
        }else{
            let okPass = ''
            let codec =  cargarPass(null,2)            
            codec.then(value=>{
                okPass = value.pass
                let envio = enviarMensajeRecuperacionContrasena(okPass,user)
                envio.then(value=>{
                    if(value===true){
                        var empleado= new Empleado ();
                        contrasenaE = empleado.encryptPassword(okPass)
                        Empleado.updateOne({"_id": user._id },{
                        $set: {"editado":true, "contrasenaE":contrasenaE}
                        },(err, ok)=>{
                            if(err){
                                return res.status(400).json({
                                    title: 'error',
                                    error: 'error al actualizar los datos',
                                    messagge: ' empleado encontrado, celular correcto y mensaje enviado, error al actualizar los datos, intentelo de nuevo',
                                })
                                //aca debemos eliminar todo lo que hayamos causado
                            }
                            if(ok){
                                return res.status(200).json({
                                    title: 'success',
                                    user,
                                    messagge: ' empleado encontrado, celular correcto y mensaje enviado y valores cambiados con exito',
                                    data: 'valores actualizados con exito'
                                })
                            }
                        })
                    }
                    if(value==='Numero de telefono invalido') {
                        return res.status(204).json({
                            title: 'success',
                            messagge: ' empleado encontrado y cedula correcta mensaje no enviado, porfavor intentalo de nuevo',
                            success:true 
                        })
                    }
                })
            })
        }
    });    
        
});
module.exports = router;
function cargarPass (empleado,n){
    return new Promise((resolve, reject) =>{
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
        let pass = ''
        for(let a=32; a<39;a++){
            pass = pass + aletoria[a]
        } 
        if(n===1){
            //el siguiebte codigo se escribe para no enviar el mensaje mientras estamos en desarrollo
            let r = {
                pass,
                valid:true
            }
            resolve(r)
            let okEnvio = enviarPass(pass,empleado) //aca ejecturamos el .then 
            okEnvio.then(res => {
                if(res===true){
                    let r = {
                        pass,
                       valid:true
                    }
                    resolve(r)
                }
                if(res==='Numero de telefono invalido') {
                    let r = {
                        cod:101,
                        res,
                        valid:false
                    }
                    resolve(r)
                }
                if(res!=true) {
            //aca validaremos cuando sea falso para enviar a al metodo que pide respuestas que a pasado
                   //console.log(res)     
                }
            })            
        }
        if(n===2){
            let r = {
                cod:202,
                pass,
                valid:true
            }
            resolve(r)
        } 
    })   
}
function enviarPass (pass,empleado){
    return new Promise((resolve,reject) => { 
        let fecha = new Date()
        fechaEnvio = fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate()
        /*Instale request ejecutando el comando "npm install --save request" */    
        var requests = require("request");
        let message = 'TEMLO.NET pass temporal '+pass+' para el inicio de sesion';
        let security = '7a17af200c92d9e409d5dfca003d8619258b217c60e778f0c3ba6'
        let client = 2116
        let phone = empleado.celular.toString()
        var options = { 
        method: 'POST',
        url: 'https://www.onurix.com/api/v1/send-sms',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
            formData: {
                key:security,
                client:client,
                phone:'+57'+phone,
                sms:message,
                'country-code':'CO'
            }
        };
        requests(options, function (error, response, body) {
            if (error){
                throw new Error(error)
            } 
            let state = JSON.parse(body)
            if(state.status===1){
                resolve(true);      
            }
            if(state.error){
                resolve(state.msg);                
            }           
        }); 
    })
}