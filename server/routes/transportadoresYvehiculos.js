const express = require('express');
const router = express.Router();
const tiposVehiculo = require('../models/tipoVehiculos.js');
const transportador = require('../models/transportador.js');
const edicionesTransportador = require('../models/edicionesPersonas.js');
const onlineT = require('../models/conectadosT.js')

const authe = require('../middlewares/midAuth.js')

router.post('/guardarTransportador', authe, async (req,res) => {
    let Transportador = new transportador(req.body)
    const contr = crearContrasena()
    console.log(contr)
    const envio = await enviarPass (contr,req.body.celularT)
    console.log(envio)
    if(envio===true){
        Transportador.contrasenaT = Transportador.encryptPassword(contr)
        Transportador.fechaAgregadoT = new Date()
        Transportador.save((err,ok)=>{
            if(ok){
                res.json({
                    status:200,
                    message:'Transportador Guardado con exito',
                    data:ok
                })                  
            }
            if(err){
                if(err.code===11000){
                    //duplicated key
                    res.json({
                        status:204,
                        message:'no se guardo el Transportador',
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
    }else{
        res.json({
            status:203,
            message:'Error al enviar el mensaje, no se guardo el transportador',
            error:err
        })
    }
    
    
})
router.post('/guardarEdicionTransportador', authe, async (req,res) => {
    console.log(req.body)
    const persona = await transportador.findOne({"_id":req.body._id})
    if(!persona){
        res.status(203).json({
            status: 203,
            message: 'error al cargar el transportador'
        })
    }else{
        const editado = new edicionesTransportador();
        editado.fechaEdicion=new Date()
        editado.descripcion = req.body.descripcion
        editado.idSquemaUpdate = req.body._id
        editado.id_empleado = req.body.id_empleado
        editado.datosAnteriores = {
            nombreT :persona.nombreT,
            primerApellidoT:persona.primerApellidoT,
            segundoApellidoT: persona.segundoApellidoT,
            celularT: persona.celularT,
            cedulaT: persona.cedulaT,
            direccionT: persona.direccionT,
            fechaNacT: persona.fechaNacT,
            emailT: persona.emailT,
        }
        const  guardado = await editado.save();
        if(!guardado){
            res.status(201).json({
                status: 201,
                message: 'error al guardar el dato de edicion, porfavor intentelo de nuevo',
                error:guardado
            })
        }else{     
            const ress = await transportador.updateOne({_id:req.body._id},{
                $set:{
                    nombreT :req.body.nombreT,
                    primerApellidoT:req.body.primerApellidoT,
                    segundoApellidoT: req.body.segundoApellidoT,
                    celularT: req.body.celularT,
                    cedulaT: req.body.cedulaT,
                    direccionT: req.body.direccionT,
                    fechaNacT: req.body.fechaNacT,
                    emailT: req.body.emailT,
                }})
            if(ress){
                res.status(200).json({
                    status: 200,
                    message: 'cliente actualizado'
                })
            }else{
                await edicionesTransportador.findByIdAndDelete(guardado._id)
                res.status(202).json({
                    status: 202,
                    message: 'error al actualizar el cliente'
                })
            }
            
        }
    }
})
router.post('/transportadores', async (req, res)=>{
    const transport = await transportador.find({estadoActivoTransportador:true})
    res.json(transport)
})
router.post('/inactivarTransportador',authe, async (req, res)=>{
    const editado = new edicionesTransportador();
    editado.fechaEdicion=new Date()
    editado.descripcion = req.body.descripcion
    editado.idSquemaUpdate = req.body._id
    editado.id_empleado = req.body.id_empleado
    editado.motivo = req.body.motivo
    const saveInactivo = await editado.save()
    const inactivo = await transportador.findByIdAndUpdate(req.body._id,{$set:{estadoActivoTransportador:false}})
    res.json(inactivo)
})
router.post('/verOnline', async (req, res)=>{
    const online = await onlineT.findOne({idTransportador:req.body._id})
    console.log(online)
    if (online) {
        res.json(true)
    }else{
        res.json(false)
    }
})
router.post('/transportadoresInactivos', async (req, res)=>{
    const transportadorInactivo = await transportador.find({estadoActivoTransportador:false})
    res.json(transportadorInactivo)
})
router.post('/reactivarTransportador',authe, async (req, res)=>{
    const editado = new edicionesTransportador();
    editado.fechaEdicion=new Date()
    editado.descripcion = req.body.descripcion
    editado.idSquemaUpdate = req.body._id
    editado.id_empleado = req.body.id_empleado
    editado.motivo = req.body.motivo
    const saveInactivo = await editado.save()
    const reactivo = await transportador.findByIdAndUpdate(req.body._id,{$set:{estadoActivoTransportador:true}})
    res.json(reactivo)
})
router.post('/edicionesTransportador', async (req, res)=>{
    const ediciones = await edicionesTransportador.find({idSquemaUpdate:req.body._id})
    res.json(ediciones)
})

function crearContrasena (){
    const cryptos = require('crypto')
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    const aletoria = cryptos.createHash('sha1').update(current_date + random).digest('hex');
    let pass = ''
    for(let a=32; a<39;a++){
        pass = pass + aletoria[a]
    }  
    return pass
}
function enviarPass (pass,celular){
    console.log(celular)
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


router.post('/cargarTiposVehiculos', async (req, res)=>{
    const tipos = await tiposVehiculo.find()
    res.json(tipos)
})
router.post('/guardarTiposVehiculos', async (req, res)=>{
    try {
        const tipos = new tiposVehiculo(req.body)
        const saveTipos = await tipos.save()
        if(saveTipos){
            res.json({success:true})
        }
    } catch (error) {
        res.json({
            success:false,
            error
        })
    }
})
router.post('/editarTiposVehiculos', async (req, res)=>{
    const tipos = await tiposVehiculo.find()
    res.json(tipos)
})

router.post('/cargarVehiculos', async (req, res)=>{
    const tipos = await tiposVehiculo.find()
    res.json(tipos)
})
router.post('/updateVehiculo', async (req, res)=>{
    const tipos = await tiposVehiculo.find()
    res.json(tipos)
})
router.post('/edicionesVehiculo', async (req, res)=>{
    const tipos = await tiposVehiculo.find()
    res.json(tipos)
})
module.exports = router;