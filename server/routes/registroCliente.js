const express = require('express');
const router = express.Router();
const nuevoCliente = require('../models/creacionClientes.js')
const Cliente = require('../models/cliente.js')
//const authe = require('../middlewares/midAuth.js')
const cryptos = require('crypto')
/* const crypto = require('crypto-js')
const contras = process.env.SECRET_KEY_TOKEN
const config = {
    authSecret : process.env.SECRET_KEY_TOKEN
} */
const {transporter} = require('../conexion/configMail.js');
async function maill (pass,mail){
    let info = await transporter.sendMail({
        from: '"Temlo.net ✔️ Verificacion" <temlonet@gmail.com>', // sender address
        to: mail, // list of receivers
        subject: "prueba de funcionamiento", // Subject line
        html: `
            <b>Codigo de verificacion: </b><strong> ${pass} </strong>
        `
    });
    if(info){
        return{success:true,info}
    }
}
router.post('/crear', async (req,res) => {
    const nuevo = new Cliente(req.body)
    nuevo.contrasenaC = nuevo.encryptPassword(req.body.passC2)
    nuevo.save(async(err,ok)=>{
        if(err){
            res.json({
                success:false,
                status:201
            })
        }
        if(ok){
            const eliminar = await nuevoCliente.deleteOne({emailC:req.body.emailC})
            if(eliminar){
                res.json({
                    success:true,
                    status:200
                })
            }else{
                res.json({
                    success:true,
                    status:202
                })
            }
        }
    })
           
})
router.post('/validarMail', async (req, res) => {
    const clienteMail = await Cliente.findOne({emailC:req.body.emailC})
    const clientecc = await Cliente.findOne({cedulaC:req.body.cedulaC})
    if(clienteMail || clientecc){
        const data = {
            state:true,
            status:0
        }
        if(clienteMail){
            data.status = 201
        }
        if(clientecc){
            data.status = 202
        }
        return res.json(data)
    }else{
        const Email = await enviarMail(req.body) 
        if(Email){
            const data = {
                state:true,
                status:200
            }
            res.json(data)
        }else{
            const data = {
                state:false,
                status:205
            }
            res.json(data)
        }
        
    }
})
router.post('/validarSMS', async (req, res) => {
    const cliente = await Cliente.findOne({celularC:req.body.celularC})
    if(cliente){
        const data = {
            state:false,
            status:201,
            cliente,
        }
        return res.json(data)
    }else{
        const celuOk = await nuevoCliente.findOne({phoneC:req.body.celularC})
        if(celuOk){
            const data = {
                state:false,
                status:204
            }
            res.json(data)
        }else{
            const updatePhoneC = await nuevoCliente.updateOne({emailC:req.body.emailC},{$set:{phoneC:req.body.celularC}})
            const SMS = await enviarSMS(req.body.celularC) 
            if(SMS){
                const data = {
                    state:true,
                    status:200
                }
                res.json(data)
            }else{
                const data = {
                    state:false,
                    status:205
                }
                res.json(data)
            }
        }
    }
})
//revisar si va primero sumar la cantidad de oportunidades o dodne esta esta bien
router.post('/validarMail2', async (req, res) => {
    const EmailValid = await nuevoCliente.findOne({emailC:req.body.emailC}) 
    if(EmailValid){
        const emailPass = EmailValid.compararContrasena(req.body.emailPass)
        if(emailPass){
            res.status(200).json(true)
        }else{
            let oportunidades = await nuevoCliente.findOne({emailC:req.body.emailC})
            let total = oportunidades.emailOportunidades + 1
            if(total<2){
                const updateMailValidate = await nuevoCliente.updateOne({emailC:req.body.emailC},{$set:{emailOportunidades:total}})
                if(updateMailValidate){
                    res.status(202).json({status:202,state:false,total})
                }
            }else{
                //si retorna 203 es qeu ya se cumplio la cantidad de posibilidades de ingresar el codigo
                res.status(203).json({status:203,state:false})
            }
        }
    }else{
        res.status(201).json(false)
    }
})
router.post('/validarSMS2', async (req, res) => {
    const smsValidate = await nuevoCliente.findOne({emailC:req.body.emailC}) 
        if(smsValidate){
        const smsPass = smsValidate.compararContrasenaSms(req.body.celularPass)
        if(smsPass){
            res.status(200).json(true)
        }else{
            let oportunidades = await nuevoCliente.findOne({emailC:req.body.emailC})
            let total = oportunidades.smsOportunidades + 1
            if(total<2){
                const updateSmsValidate = await nuevoCliente.updateOne({emailC:req.body.emailC},{$set:{smsOportunidades:total}})
                if(updateSmsValidate){
                    res.status(202).json({status:202,state:false,total})
                }
            }else{
                //si retorna 203 es qeu ya se cumplio la cantidad de posibilidades de ingresar el codigo
                res.status(203).json({status:203,state:false})
            }
        }
    }else{
        res.status(201).json(false)
    }
})

router.post('/eliminarRegistro', async (req, res) => {
    const deleteMailValidate = await nuevoCliente.deleteOne({emailC:req.body.emailC}) 
    if(deleteMailValidate){
        res.json(deleteMailValidate)
    }else{
        console.log('ocurrio un errror')
    }
})
module.exports = router;
async function cargarPass(){
    return new Promise((resolve, reject) =>{
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
        let pass = ''
        for(let a=32; a<36;a++){
            pass = pass + aletoria[a]
        } 
        resolve(pass)
    }) 
}
async function enviarSMS (celularC){
    let pass = await cargarPass()
    console.log(pass)
    const x = new nuevoCliente()
    if(pass){
        const passEncripted = x.encryptPassword(pass)
        const updatePhoneC = await nuevoCliente.updateOne({phoneC:celularC},{$set:{phonePass:passEncripted}})
        return new Promise((resolve,reject) => { 
        var requests = require("request");
        let message = 'Tu codigo de verificacion para la creacion del cliente es: '+ pass
        let security = '7a17af200c92d9e409d5dfca003d8619258b217c60e778f0c3ba6'
        let client = 2116
        let phone = celularC.toString()
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
                resolve(false);                
            }           
        }); 
    })
    } 
}
async function enviarMail(cliente){
    let pass = await cargarPass()
    return new Promise((resolve, reject)=>{  
        console.log(pass)
        if(pass){
            //aca enviaremos el mail con la contraseña de 4 digitos creada aleatoriamente
            //si el correo no existe retorneremos un error, como no tenemos una funcion en nodemailer que nos 
            //permita validar los errores o los fallos de correo entonces lo validsaremos e¿cne l tiempo de envio del factor de 
            //autentificacin en dos passos
            //si si existe
            //guardaremos en la bd el mail y el codigo que le a sido enviado
            let ok = new nuevoCliente(cliente)
            ok.emailPass=ok.encryptPassword(pass)
            ok.save((err,ok)=>{
                //y retornaremos el estado de la funcion sea true o false
                //para validarlos en el siguiente paso
                if(err){
                    resolve(false)
                }
                if(ok){
                    const okMail = maill(pass,cliente.emailC)
                    okMail.then((result) => {
                        if(result.success){
                            resolve(true)
                        }
                    })
                }
            })
        }
    })
    
}