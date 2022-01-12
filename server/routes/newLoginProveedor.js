
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const empleadoProveedor = require('../models/empleadosProveedores.js');
const cryptos = require('crypto')
const crypto = require('crypto-js')
const contras = process.env.SECRET_KEY_TOKEN
const config = {
    authSecret : process.env.SECRET_KEY_TOKEN
}
const {transporter} = require('../conexion/configMail.js');
router.post('/cambiandoPassword', async( req, res)=>{
    const encriptador = new empleadoProveedor()
    const newPassSecure = encriptador.encryptPassword(req.body.newPass)
    const updateEmpleado = await empleadoProveedor.updateOne({cedulaEP:req.body.user},{$set:{editado:false, contrasenaEP:newPassSecure, conCelular:false, conMail:false}})
    if(updateEmpleado.modifiedCount>0){
        res.json({ 
            success:true,
            status:200
        })
    } else {
        res.json({ 
            success:false,
            status:202
        })
    }     
})
router.post('/iniSesion', async( req, res)=>{
    console.log(req.body)
    const empleadoP = await empleadoProveedor.findOne({cedulaEP:req.body.user}).populate('empresaProveedoraEP')
    console.log(empleadoP)
    if (!empleadoP){
        return res.json({
            title: 'usuario no existe',
            error: ' cedula no registrada',
            success:false,
            status:202
        });
    }else if(empleadoP.empresaProveedoraEP.nitProveedor!=req.body.nitEmpresa){
        return res.json({
            title: 'Error en nit',
            error: 'Nit erroneo',
            success:false,
            status:204,
        });
    }else if (!empleadoP.compararContrasena(req.body.pass)){
        const editado = empleadoP.editado
        let conQ = ''
        if(empleadoP.conCelular){
            conQ = 'Celular'
        }
        if(empleadoP.conMail){
            conQ = 'Email'
        }
        return res.json({
            title: 'Error en Contrasena',
            error: 'Contrasena Erronea',
            success:false,
            editado:editado,
            conQ,
            status:203,
        });
    }else if(empleadoP.activo==true){ 
        if(empleadoP.editado==false){
            let usuario = {
                celularE:empleadoP.celularEP,
            }
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
            let pass = ''
            for(let a=32; a<39;a++){
                pass = pass + aletoria[a]
            }
            if(req.body.sms){
                let mensaje =  await enviarPass(pass,usuario)
                if(mensaje===true){
                    const coded = crypto.AES.encrypt(pass, contras).toString()
                    res.json({ 
                        status:200,
                        rol:empleadoP.rol,
                        coded
                    })
                }
                if(mensaje===false){
                    if(mensaje.cod === 101){
                        return res.json({ 
                            status:101,
                            succes:false,
                            error:'numero de telefono invalido'
                        })
                    }else{
                        return res.json({ 
                            status:103,
                            succes:false,
                            error:'ocurrio un error al enviar el menmsaje'
                        })
                    }
                    //en caso de que se presenten mas errores aca los podremos empezar a listar
                }  
            } else if(req.body.email){
                let okEnvio = await maill(pass,empleadoP.emailEP)
                if(okEnvio){
                    const coded = crypto.AES.encrypt(pass, contras).toString()
                    res.json({ 
                        success:true,
                        status:200,
                        rol:empleadoP.rol,
                        coded
                    })
                }
            }    
        }else{
            let conQ = ''
            if(empleadoP.conCelular){
                conQ = 'Celular'
            }
            if(empleadoP.conMail){
                conQ = 'Email'
            }
            res.json({ 
                conQ,
                usuario:empleadoP.nombreEP+' '+empleadoP.primerApellidoEP+' '+empleadoP.segundoApellidoEP,
                success:true,
                status:201
            })
        } 
    }else{
        res.json({ 
            success:false,
            status:209,
            error:'empleado inactivo'
        })
    }     
});
router.post('/recuperarContrasenaCel', async( req, res)=>{
    const empleado = await empleadoProveedor.findOne({cedulaEP:parseInt(req.body.codigo)}).populate('empresaProveedoraEP')
    console.log(empleado)
        if(empleado){
            if(empleado.empresaProveedoraEP.nitProveedor!=req.body.nitEmpresa){
                res.json({
                    title: 'Nit empresa no corresponde al empleado registrado',
                    success:false,
                    status:201
                })
            }else if(empleado.celularEP!=req.body.celE){
                res.json({
                    title: 'telefono no corresponde al empleado registrado',
                    success:false,
                    status:203
                })
            }else{
                var current_date = (new Date()).valueOf().toString();
                var random = Math.random().toString();
                const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
                let pass = ''
                for(let a=32; a<39;a++){
                    pass = pass + aletoria[a]
                }
                console.log('pass')
                console.log(pass)
                const encriptador = new empleadoProveedor()
                const newPassSecure = encriptador.encryptPassword(pass)
                const updateCliente = await empleadoProveedor.updateOne({cedulaEP:parseInt(req.body.codigo)},{$set:{editado:true, contrasenaEP:newPassSecure, conCelular:true,conMail:false}})
                if(updateCliente){
                    let okEnvio = await enviarPass(pass,empleado)
                    console.log(okEnvio)
                    if(okEnvio){
                        res.json({ 
                            success:true,
                            status:200
                        })
                    }
                }
            }
        }else{
            res.json({
                title: 'codigo no corresponde, empleado no existe',
                success:false,
                status:202
            })
        }
})
router.post('/recuperarContrasenaMail', async( req, res)=>{
    const empleado = await empleadoProveedor.findOne({cedulaEP:req.body.codigo}).populate('empresaProveedoraEP')
        if(empleado){
            if(empleado.empresaProveedoraEP.nitProveedor!=req.body.nitEmpresa){
                res.json({
                    title: 'Nit empresa no corresponde al empleado registrado',
                    success:false,
                    status:201
                })
            }else if(empleado.emailEP!=req.body.mailE){
                res.json({
                    title: 'email no corresponde al empleado registrado',
                    success:false,
                    status:203
                })
            }else{
                var current_date = (new Date()).valueOf().toString();
                var random = Math.random().toString();
                const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
                let pass = ''
                for(let a=32; a<39;a++){
                    pass = pass + aletoria[a]
                }
                console.log('pass')
                console.log(pass)
                const encriptador = new empleadoProveedor()
                const newPassSecure = encriptador.encryptPassword(pass)
                const updateCliente = await empleadoProveedor.updateOne({cedulaEP:req.body.codigo},{$set:{editado:true, contrasenaEP:newPassSecure, conMail:true, conCelular:false}})
                if(updateCliente){
                    let okEnvio = await maill(pass,empleado.emailEP)
                    console.log(okEnvio)
                    if(okEnvio){
                        res.json({ 
                            success:true,
                            status:200
                        })
                    }
                }
            }
        }else{
            res.json({
                title: 'codigo no corresponde, empleado no existe',
                success:false,
                status:202
            })
        }
})
router.post('/loginEmpleadoProveedor', async (req, res)=>{
    const empleado = await empleadoProveedor.findOne({cedulaEP:req.body.user})
    if(empleado){
        if (!empleado.compararContrasena(req.body.pass)){
            res.json({
                title: 'Error en Contrasena',
                error: 'Contrasena Erronea',
                success:false,
                status:203,
                editado:false
            })
        }else {
            const payload = {
                _id:empleado._id,
            }
                const token = jwt.sign(payload,config.authSecret,{
                expiresIn: 10800
            })
            res.json({ 
                success:true,
                token,
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
});
router.get('/empleadoProveedor',async (req, res)=>{
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
                const _id=decoded._id
                let userr = await empleadoProveedor.findOne({'_id':_id}).populate('empresaProveedoraEP')
                res.json(userr)                
            }
        });
    }
    else{
        return res.status(401).json({message: 'unauthorized'})
    }
})
module.exports = router;
function enviarPass (pass,cliente){
    console.log(pass)
    console.log('pass')
    console.log(cliente)
    return new Promise((resolve,reject) => { 
        /*Instale request ejecutando el comando "npm install --save request" */    
        var requests = require("request");
        let message = 'TEMLO.NET pass temporal '+pass+' para el inicio de sesion';
        let security = '7a17af200c92d9e409d5dfca003d8619258b217c60e778f0c3ba6'
        let client = 2116
        let phone = cliente.celularE
        console.log(phone)
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
        resolve(true); 
    })
}
async function maill (pass,mail){
    console.log('passMail')
    console.log(pass)
    let info = await transporter.sendMail({
        from: '"Temlo.net ✔️ Verificacion" <temlonet@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: "Codigo de verificacion", // Subject line
        html: `<b>Codigo de verificacion: </b><strong> ${pass} </strong>`
    });
    if(info){
            return new Promise((resolve,reject) => {  
            resolve({success:true,info})
        })
    }
}