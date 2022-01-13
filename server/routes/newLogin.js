const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Cliente = require('../models/cliente.js')
const cryptos = require('crypto')
const crypto = require('crypto-js')
const contras = process.env.SECRET_KEY_TOKEN
const config = {
    authSecret : process.env.SECRET_KEY_TOKEN
}
const authe = require('../middlewares/midAuth.js')

const {transporter} = require('../conexion/configMail.js');

//el token en el cliente dura 10800 segundos lo que equivale a 3 horas.
//si en estre tiempo el cliente no realizo la compra, se porcedera a verificar si el cliente esta en linea
//si es asi se revalidara el token para poder seguir comprando, de lo contrario,
//si no valida el estado en linea se cerara la sesion del cliente y
//si tiene rpoductos en el carrito, debera volver a realizar la compra
async function maill (pass,mail){
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
router.post('/cambiandoPassword', async( req, res)=>{
    if(req.body.celular){
        const encriptador = new Cliente()
        const newPassSecure = encriptador.encryptPassword(req.body.newPass)
        const updateCliente = await Cliente.updateOne({celularC:req.body.celular},{$set:{editado:false, contrasenaC:newPassSecure, conCelular:false}})
        if(updateCliente){
            res.json({ 
                success:true,
                status:200
            })
        }
    }  
    if(req.body.emailC){
        const encriptador = new Cliente()
        const newPassSecure = encriptador.encryptPassword(req.body.newPass)
        const updateCliente = await Cliente.updateOne({emailC:req.body.emailC},{$set:{editado:false, contrasenaC:newPassSecure, conMail:false}})
        if(updateCliente){
            res.json({ 
                success:true,
                status:200
            })
        }
    }  
    if(req.body.user){
        const encriptador = new Cliente()
        const newPassSecure = encriptador.encryptPassword(req.body.newPass)
        if(req.body.user.match(/[0-9]/)){
            const updateCliente = await Cliente.updateOne({cedulaC:req.body.user},{$set:{editado:false, contrasenaC:newPassSecure, conCelular:false, conMail:false}})
            if(updateCliente){
                res.json({ 
                    success:true,
                    status:200
                })
            }else{
                const updateCliente = await Cliente.updateOne({celularC:req.body.user},{$set:{editado:false, contrasenaC:newPassSecure, conCelular:false, conMail:false}})
                if(updateCliente){
                    res.json({ 
                        success:true,
                        status:200
                    })
                }
            }
        }else if(req.body.user.match(/[@]/)){
            const updateCliente = await Cliente.updateOne({emailC:req.body.user},{$set:{editado:false, contrasenaC:newPassSecure, conCelular:false, conMail:false}})
            if(updateCliente){
                res.json({ 
                    success:true,
                    status:200
                })
            }
        }
       
    }              
})
router.post('/recuperarContrasenaMail', async( req, res)=>{
    const cliente = await Cliente.findOne({cedulaC:req.body.codigo})
        if(cliente){
            if(cliente.emailC!=req.body.mailE){
                res.json({
                    title: 'email no corresponde al cliente registrado',
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
                const encriptador = new Cliente()
                const newPassSecure = encriptador.encryptPassword(pass)
                const updateCliente = await Cliente.updateOne({cedulaC:req.body.codigo},{$set:{editado:true, contrasenaC:newPassSecure, conMail:true, conCelular:false}})
                if(updateCliente){
                    let okEnvio = await maill(pass,cliente.emailC)
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
                title: 'codigo no corresponde, cliente no existe',
                success:false,
                status:202
            })
        }
})
router.post('/recuperarContrasenaCel', async( req, res)=>{
    const cliente = await Cliente.findOne({cedulaC:parseInt(req.body.codigo)})
    console.log(cliente)
        if(cliente){
            if(cliente.celularC!=req.body.celE){
                res.json({
                    title: 'telefono no corresponde al cliente registrado',
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
                const encriptador = new Cliente()
                const newPassSecure = encriptador.encryptPassword(pass)
                const updateCliente = await Cliente.updateOne({cedulaC:req.body.codigo},{$set:{editado:true, contrasenaC:newPassSecure, conCelular:true, conMail:false}})
                if(updateCliente){
                    let okEnvio = await enviarPass(pass,cliente)
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
                title: 'codigo no corresponde, cliente no existe',
                success:false,
                status:202
            })
        }
})
router.post('/MAIL', async( req, res)=>{
    const cliente2 = await Cliente.findOne({emailC:req.body.emailC})
    if(cliente2){
        if(cliente2.editado){
            if(cliente2.conCelular){
                res.json({ 
                    success:false,
                    status:204,
                    conCelular:true
                })
            }else if(cliente2.conMail){
                res.json({ 
                    success:false,
                    status:204,
                    conMail:true
                })
            }
        }else{
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
            let pass = ''
            for(let a=32; a<39;a++){
                pass = pass + aletoria[a]
            } 
            let okEnvio = await maill(pass,cliente2.emailC)
            console.log('pass')
            console.log(pass)
            if(okEnvio.success===true){
                pass = crypto.AES.encrypt(pass, contras).toString()    
                res.json({ 
                    status:200,
                    success:true,
                    pass,
                })
            }
        }
    }else{
        res.json({
            title: 'usuario no existe',
            success:false,
            status:202
        })
    }
})
router.post('/SMS', async( req, res)=>{
    const cliente2 = await Cliente.findOne({celularC:req.body.celular})
    if(cliente2){
        if(cliente2.editado){
            if(cliente2.conCelular){
                res.json({ 
                    success:false,
                    status:204,
                    conCelular:true
                })
            }else if(cliente2.conMail){
                res.json({ 
                    success:false,
                    status:204,
                    conMail:true
                })
            }
        }else{
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
            let pass = ''
            for(let a=32; a<39;a++){
                pass = pass + aletoria[a]
            } 
            let okEnvio = await enviarPass(pass,cliente2)
            if(okEnvio){
                pass = crypto.AES.encrypt(pass, contras).toString()    
                res.json({ 
                    status:200,
                    success:true,
                    pass,
                })
            }
            if(okEnvio==='Numero de telefono invalido') {
                res.json({ 
                    status:201,
                    succes:false,
                    error:'numero de telefono invalido'
                })
            } 
        }
    }else{
        res.json({
            title: 'usuario no existe',
            success:false,
            status:202
        })
    }
})
router.post('/loginCliente', async (req, res)=>{
    if(req.body.email){
        const cliente = await Cliente.findOne({emailC:req.body.emailC})
        if(cliente){
            if(cliente.editado){
                if (!cliente.compararContrasena(req.body.pass)){
                    res.json({
                        title: 'Error en Contrasena',
                        error: 'Contrasena Erronea',
                        success:false,
                        status:203,
                    })
                }else {
                    res.json({ 
                        success:false,
                        status:204,
                    })
                }
            }else{
                const payload = {
                    _id:cliente._id,
                }
                    const token = jwt.sign(payload,config.authSecret,{
                    expiresIn: 10800
                })
                console.log(token)
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
    }else if(req.body.sms){
        const cliente = await Cliente.findOne({celularC:req.body.celular})
        if(cliente){
            if(cliente.editado){
                if (!cliente.compararContrasena(req.body.pass)){
                    res.json({
                        title: 'Error en Contrasena',
                        error: 'Contrasena Erronea',
                        success:false,
                        status:205,
                    })
                }else {
                    res.json({ 
                        success:false,
                        status:204,
                    })
                }
            }else{
                const payload = {
                    _id:cliente._id,
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
    }else if(req.body.user.match(/[0-9]/)){
        const cliente = await Cliente.findOne({cedulaC:req.body.user})
        if(cliente){
            if(cliente.editado){
                if (!cliente.compararContrasena(req.body.pass)){
                    res.json({
                        title: 'Error en Contrasena',
                        error: 'Contrasena Erronea',
                        success:false,
                        status:203,
                        editado:true
                    })
                }else{
                    res.json({ 
                        success:false,
                        status:204,
                    })
                }
            }else{
                if (!cliente.compararContrasena(req.body.pass)){
                    res.json({
                        title: 'Error en Contrasena',
                        error: 'Contrasena Erronea',
                        success:false,
                        status:203,
                        editado:false
                    })
                }else {
                    const payload = {
                        _id:cliente._id,
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
            }       
        }else{
            const cliente2 = await Cliente.findOne({celularC:req.body.user})
            if(cliente2){
                if(cliente2.editado){
                    if (!cliente2.compararContrasena(req.body.pass)){
                        res.json({
                            title: 'Error en Contrasena',
                            error: 'Contrasena Erronea',
                            success:false,
                            status:203,
                            editado:true
                        })
                    }else{
                        res.json({ 
                            success:false,
                            status:204,
                        })
                    }
                }else{
                    if (!cliente2.compararContrasena(req.body.pass)){
                        res.json({
                            title: 'Error en Contrasena',
                            error: 'Contrasena Erronea',
                            success:false,
                            status:203,
                            editado:false
                        })
                    }else {
                        const payload = {
                            _id:cliente2._id,
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
                }
            }else{
                res.json({
                    title: 'usuario no existe',
                    success:false,
                    status:202
                })
            }
        }
    }else if(req.body.user.match(/[@]/)){
        const cliente1 = await Cliente.findOne({emailC:req.body.user})
        if(cliente1){
            if(cliente1.editado){
                if (!cliente1.compararContrasena(req.body.pass)){
                    res.json({
                        title: 'Error en Contrasena',
                        error: 'Contrasena Erronea',
                        success:false,
                        status:203,
                        editado:true,
                    })
                }else {
                    res.json({ 
                        success:false,
                        status:204,
                    })
                }
            }else{
                if (!cliente1.compararContrasena(req.body.pass)){
                    res.json({
                        title: 'Error en Contrasena',
                        error: 'Contrasena Erronea',
                        success:false,
                        status:203,
                        editado:false,
                    })
                }else {
                    const payload = {
                        _id:cliente1._id,
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
            }   
        }else{
            res.json({
                title: 'usuario no existe',
                success:false,
                status:202
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
router.get('/cliente',async (req, res)=>{
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
                let userr = await Cliente.findOne({'_id':_id})
                res.json(userr)                
            }
        });
    }
    else{
        return res.status(401).json({message: 'unauthorized'})
    }
})
router.post('/actualizarToken',authe, async (req, res)=>{
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
                let userr = await Cliente.findOne({'_id':_id})
                const payload = {
                    _id:userr._id,
                }
                    const token = jwt.sign(payload,config.authSecret,{
                    expiresIn: 10800
                })
                console.log(token)
                res.json({ 
                    success:true,
                    token,
                    status:200
                })    
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
    return new Promise((resolve,reject) => { 
        /*Instale request ejecutando el comando "npm install --save request" */    
        var requests = require("request");
        let message = 'TEMLO.NET pass temporal '+pass+' para el inicio de sesion';
        let security = '7a17af200c92d9e409d5dfca003d8619258b217c60e778f0c3ba6'
        let client = 2116
        let phone = cliente.celularC
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
