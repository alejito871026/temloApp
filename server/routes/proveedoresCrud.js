const express = require('express');
const router = express.Router();

const Proveedores = require('../models/proveedores.js');
const empleadosProveedores = require('../models/empleadosProveedores.js');
const editPersonas = require('../models/edicionesPersonas.js')
const authe = require('../middlewares/midAuth.js')

router.post('/guardarCoordenadas', authe, async (req,res)=>{
    const coord = await Proveedores.updateOne({_id:req.body._id},{$set:{coordenadasProveedor:{longitude:req.body.lng,latitude:req.body.lat}}})
    if(coord.modifiedCount>0){
        res.json({
            success:true,
            status:200
        })
    }else{
        res.json({
            success:false,
            status:202
        })
    }
})

router.post('/guardarProveedor',authe, async (req, res) => {
    try {
        const proveedorOk = new Proveedores(req.body)
        const proveedorGuardado = await proveedorOk.save()
        const admin = new empleadosProveedores(req.body.super)
        const contra = await crearContrasena()
        console.log(contra)
        admin.contrasenaEP = admin.encryptPassword(contra)
        admin.empresaProveedoraEP = proveedorGuardado._id
        const superAdmin = await admin.save()
        if(superAdmin){
            res.json({success:true}) 
        }       
    } catch (error) {
        res.json(error)
    }
    
})
router.get('/proveedores',authe, async (req, res) => {
    const proveedores = await Proveedores.find();
    res.json(proveedores)
})
router.post('/guardarEmpleado', authe, async (req,res) => {
    let empleadosProveedoress = new empleadosProveedores(req.body)
    let contr = crearContrasena()
    contr.then(async ress=>{
        const envio = await enviarPass (ress,req.body.celularEP)
        if(envio){
            empleadosProveedoress.contrasenaEP = empleadosProveedoress.encryptPassword(ress)
            empleadosProveedoress.fechaAgregadoEP = new Date()
            empleadosProveedoress.save((err,ok)=>{
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
                }else{
                    res.json({
                        status:205,
                        message:'error al enviar mensaje',
                        error:envio
                    })
                }
            })
        }
    })
})
router.post('/ejecutivosInactivos', authe, async ( req, res)=>{
    const ejecutivos = await empleadosProveedores.find({'activo':false,empresaProveedoraEP:req.body.id}).populate('empresaProveedoraEP')
    res.json(ejecutivos)
}) 
router.post('/ejecutivos', authe, async ( req, res)=>{
    const ejecutivos = await empleadosProveedores.find({'activo':true,empresaProveedoraEP:req.body.id}).populate('empresaProveedoraEP')
    res.json(ejecutivos)
})
router.post('/guardarEdicionEjecutivo', authe, async (req,res) => {
    var persona = await empleadosProveedores.find({"_id":req.body._id})
    if(!persona){
        return next(new Error('no se pudo cargar documento'))
    }else{
        const editado = new editPersonas();
        editado.descripcion=req.body.descripcionEdicion;
        editado.idEmpleado=req.body.idEmpleadoEditor;
        editado.fechaEdicion=new Date()
        editado.idSquemaUpdate = req.body._id
        let datos = {
            nombreEP :persona[0].nombreEP,
            primerApellidoEP:persona[0].primerApellidoEP,
            segundoApellidoEP: persona[0].segundoApellidoEP,
            celularEP: persona[0].celularEP,
            cedulaEP: persona[0].cedulaEP,
            direccionEP: persona[0].direccionEP,
            fechaNacEP: persona[0].fechaNacEP,
            emailEP: persona[0].emailEP,
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
            const ress = await empleadosProveedores.updateOne({_id:req.body._id},{
                $set:{
                    nombreEP :req.body.nombreEP,
                    primerApellidoEP:req.body.primerApellidoEP,
                    segundoApellidoEP: req.body.segundoApellidoEP,
                    celularEP: req.body.celularEP,
                    cedulaEP: req.body.cedulaEP,
                    direccionEP: req.body.direccionEP,
                    fechaNacEP: req.body.fechaNacEP,
                    emailEP: req.body.emailEP,
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
    const inactivo = await empleadosProveedores.updateOne({'_id':req.body._id},{$set:{activo:false}})
    res.json(inactivo)
})
router.post('/reactivarEmpleados',authe, async (req, res)=>{
    const reactivo = await empleadosProveedores.updateOne({'_id':req.body._id},{$set:{activo:true}})
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
                resolve(false,state.msg);                
            }           
        }); 
    })
}