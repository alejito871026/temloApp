const express = require('express');
const router = express.Router();
const empleadoTemlo = require('../models/empleadoTemlo.js')
const empleadoProveedor = require('../models/empleadosProveedores.js');
const editPersonas = require('../models/edicionesPersonas.js')
const authe = require('../middlewares/midAuth.js')

router.post('/cambioContrasena', async (req, res) => {
    let emp = new empleadoTemlo()
    contrasena = emp.encryptPassword(req.body.contrasenaNueva)
    empleadoTemlo.updateOne({'_id':req.body._id},{$set:{'contrasenaE':contrasena, 'editado':false}},(err, ok)=>{
        if(err){
            return res.status(204).json({
                title: 'error',
                error: 'error al actualizar informacion del empleado',
                err
            })
        }else{
            return res.status(200).json({                
                data: ok
            })
        }
    }); 
})
router.post('/cambioContrasenaProveedores', async (req, res) => {
    let emp = new empleadoProveedor()
    contrasena = emp.encryptPassword(req.body.contrasenaNueva)
    empleadoProveedor.updateOne({'_id':req.body._id},{$set:{'contrasenaEP':contrasena, 'editadoEP':false}},(err, ok)=>{
        if(err){
            return res.status(204).json({
                title: 'error',
                error: 'error al actualizar informacion del empleado',
                err
            })
        }else{
            return res.status(200).json({                
                data: ok
            })
        }
    }); 
})
router.post('/cambioContrasenaTransportador', async (req, res) => {
    let emp = new empleadoTemlo()
    contrasena = emp.encryptPassword(req.body.contrasenaNueva)
    empleadoTemlo.updateOne({'_id':req.body._id},{$set:{'contrasenaE':contrasena, 'editado':false}},(err, ok)=>{
        if(err){
            return res.status(204).json({
                title: 'error',
                error: 'error al actualizar informacion del empleado',
                err
            })
        }else{
            return res.status(200).json({                
                data: ok
            })
        }
    }); 
})
router.post('/guardarEmpleado', authe, async (req,res) => {
    let empleadoTemloo = new empleadoTemlo(req.body)
    let contr = crearContrasena()
    contr.then(async ress=>{
        const envio = await enviarPass (ress,req.body.celularE)
        empleadoTemloo.contrasenaE = empleadoTemloo.encryptPassword(ress)
        empleadoTemloo.fechaAgregado = new Date()
        empleadoTemloo.save((err,ok)=>{
            if(ok){
                res.json({
                    status:200,
                    message:'Empleado Guardado con exito',
                    data:ok
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
                        status:206,
                        message:'tipo de dato erroneo',
                        error:err
                    })
                }           
            }
        })
    })
})
router.post('/ejecutivosInactivos', authe, async ( req, res)=>{
    const ejecutivos = await empleadoTemlo.find({'activo':false}).populate('empresa')
    res.json(ejecutivos)
})
router.post('/ejecutivos', authe, async ( req, res)=>{
    const ejecutivos = await empleadoTemlo.find({'activo':true}).populate('empresa')
    res.json(ejecutivos)
})
router.post('/guardarEdicionEjecutivo', authe, async (req,res) => {
    var persona = await empleadoTemlo.find({"_id":req.body._id})
    if(!persona){
        return next(new Error('no se pudo cargar documento'))
    }else{
        const editado = new editPersonas();
        editado.descripcion=req.body.descripcionEdicion;
        editado.idEmpleado=req.body.idEmpleadoEditor;
        let f = new Date().getDate() + "/" +(new Date().getMonth() + 1) + "/" + new Date().getFullYear();
        editado.fechaEdicion=new Date(f)
        editado.idSquemaUpdate = req.body._id
        let datos = {
            nombreE :persona[0].nombreE,
            primerApellidoE:persona[0].primerApellidoE,
            segundoApellidoE: persona[0].segundoApellidoE,
            celularE: persona[0].celularE,
            cedulaE: persona[0].cedulaE,
            direccionE: persona[0].direccionE,
            fechaNacE: persona[0].fechaNacE,
            emailE: persona[0].emailE,
            rol:persona[0].rol,
        }
        editado.datosAnteriores=datos;
        const  guardado = await editado.save();
        if(!guardado){
            res.status(201).json({
                status: 201,
                message: 'error al guardar el dato de edicion, porfavor intentelo de nuevo',
                error:guardado
            })
        }else{     
            const ress = await empleadoTemlo.updateOne({_id:req.body._id},{
                $set:{
                    nombreE :req.body.nombreE,
                    primerApellidoE:req.body.primerApellidoE,
                    segundoApellidoE: req.body.segundoApellidoE,
                    celularE: req.body.celularE,
                    cedulaE: req.body.cedulaE,
                    direccionE: req.body.direccionE,
                    fechaNacE: req.body.fechaNacE,
                    emailE: req.body.emailE,
                    rol:req.body.rol,
                }})
            if(ress){
                res.status(200).json({
                    status: 200,
                    message: 'cliente actualizado'
                })
            }else{
                res.status(202).json({
                    status: 202,
                    error:ress,
                    message: 'error al actualizar el cliente'
                })
            }
            
        }
    }
})
router.post('/edicionesEmpleados',authe, async (req, res)=>{
    const ediciones = await editPersonas.find({'idSquemaUpdate':req.body._id})
    res.json(ediciones)
})
router.post('/inactivarEmpleados',authe, async (req, res)=>{
    const inactivo = await empleadoTemlo.updateOne({'_id':req.body._id},{$set:{activo:false}})
    res.json(inactivo)
})
router.post('/reactivarEmpleados',authe, async (req, res)=>{
    const reactivo = await empleadoTemlo.updateOne({'_id':req.body._id},{$set:{activo:true}})
    res.json(reactivo)
})

module.exports = router;

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
        resolve(pass)
    })    
}
function enviarPass (pass,celular){
    return new Promise((resolve,reject) => { 
        /*Instale request ejecutando el comando "npm install --save request" */    
        var requests = require("request");
        let message = 'TEMLO.NET pass temporal '+pass+' para el inicio de sesion';
        let security = '7a17af200c92d9e409d5dfca003d8619258b217c60e778f0c3ba6'
        let client = 2116
        let phone = celular.toString()
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