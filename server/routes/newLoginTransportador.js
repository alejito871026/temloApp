
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const empleadoTemlo = require('../models/empleadoTemlo.js');
const cryptos = require('crypto')
const crypto = require('crypto-js')
const contras = process.env.SECRET_KEY_TOKEN
const config = {
    authSecret : process.env.SECRET_KEY_TOKEN
}
const {transporter} = require('../conexion/configMail.js');

router.post('/recuperarContrasenaCel', async( req, res)=>{
    const empleado = await empleadoTemlo.findOne({cedulaE:parseInt(req.body.codigo)}).populate('empresa')
        if(empleado){
            if(empleado.empresa[0].nit!=req.body.nitEmpresa){
                res.json({
                    title: 'Nit empresa no corresponde al empleado registrado',
                    success:false,
                    status:201
                })
            }else if(empleado.celularE!=req.body.celE){
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
                const encriptador = new empleadoTemlo()
                const newPassSecure = encriptador.encryptPassword(pass)
                const updateCliente = await empleadoTemlo.updateOne({cedulaE:parseInt(req.body.codigo)},{$set:{editado:true, contrasenaE:newPassSecure, conCelular:true,conMail:false}})
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
    const empleado = await empleadoTemlo.findOne({cedulaE:req.body.codigo}).populate('empresa')
        if(empleado){
            if(empleado.empresa[0].nit!=req.body.nitEmpresa){
                res.json({
                    title: 'Nit empresa no corresponde al empleado registrado',
                    success:false,
                    status:201
                })
            }else if(empleado.emailE!=req.body.mailE){
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
                const encriptador = new empleadoTemlo()
                const newPassSecure = encriptador.encryptPassword(pass)
                const updateCliente = await empleadoTemlo.updateOne({cedulaE:req.body.codigo},{$set:{editado:true, contrasenaE:newPassSecure, conMail:true, conCelular:false}})
                if(updateCliente){
                    let okEnvio = await maill(pass,empleado.emailE)
                    console.log(okEnvio.envelope.to)
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
router.post('/loginEmpleadoTemlo', async (req, res)=>{
    console.log(req.body)
    const empleado = await empleadoTemlo.findOne({cedulaC:req.body.user})
    if(empleado){
        if(empleado.editado){
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
        }       
    }else{
        res.json({
            title: 'usuario no existe',
            success:false,
            status:202
        })
    }
});
router.get('/empleadoTemlo',async (req, res)=>{
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