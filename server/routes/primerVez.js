const express = require('express');
const router = express.Router();

const Temlo = require('../models/temlo.js');
const EmpleadoTemlo = require('../models/empleadoTemlo.js');

router.post('/cantidad', async (req, res) => {
    var cantidad = await Temlo.countDocuments() 
    res.json({cantidad})
})

router.post('/guardarDatosPrimeraVez', validarCantidad, async (req, res) => {
    let empleadoTemlo = new EmpleadoTemlo(req.body.empleado)
    let temlo = new Temlo(req.body.empresa)
    empleadoTemlo.rol = 'SUPERADMIN'
    let contr = crearContrasena()
    contr.then(async (ress)=> {
        console.log(ress)
        const envio = await enviarPass (ress,req.body.empleado)
        console.log(envio)
        if(envio){
            empleadoTemlo.contrasenaE = empleadoTemlo.encryptPassword(ress)
            empleadoTemlo.fechaAgregado = new Date()
            empleadoTemlo.empresa = temlo._id
            empleadoTemlo.save(async(err,ok)=>{
                if(ok){
                    temlo.superAdmin = ok._id
                    temlo.save((err,ok)=>{
                        if(ok){
                            res.json({
                                status:200,
                                message:'Guardado con exito',
                                data:ok
                            }) 
                        }
                        if(err){
                            //debemos borrar el empleado creado
                            const eliminar = eliminarEmpleado(empleadoTemlo._id)
                            eliminar.then(response=>{
                                res.json({
                                    message:'usuario eliminado, hubo un error al guardar la empresa',
                                    error:err,
                                }) 
                            })
                        }
                    })                   
                }
                if(err){
                    if(err.code===11000){
                        //duplicated key
                        res.json({
                            status:204,
                            message:'no se guardo el empleado',
                            code:err.code,
                            error:err.keyValue
                        })            
                    }else{
                        //otros errores
                        res.json({
                            status:205,
                            message:'tipo de dato erroneo',
                            error:err
                        })
                    }           
                }
            })
        }else{

        }
        
    
    })
})
async function validarCantidad(req,res,next){
    var cantidad = await Temlo.countDocuments()
    if(cantidad===0){
        next()
    }else{
        res.json({
            status:201,
            message:'no permito ya existe empresa'
        })
    }
}
function crearContrasena (){
    const cryptos = require('crypto')
    return new Promise((resolve, reject) =>{
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
        let pass = ''
        for(let a=32; a<39;a++){
            pass = pass + aletoria[a]
        }
        console.log(pass)
        resolve(pass)
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
        let phone = empleado.celularE.toString()
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
module.exports = router;
async function eliminarEmpleado(id){
    const eliminado = await EmpleadoTemlo.deleteOne({_id:id})
    return eliminado
}