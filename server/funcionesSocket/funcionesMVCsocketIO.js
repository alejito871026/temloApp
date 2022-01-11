const OnlineT = require('../models/conectadosT.js')
const OnlineP = require('../models/conectadosP.js')
const OnlineTEM = require('../models/conectadosTemlo.js')
const OnlineCLI = require('../models/conectadosClientes.js')
const proveedores = require('../models/proveedores.js')
const temlo = require('../models/temlo.js')
const f = {}
f.cargarOnline = async(data)=>{
    if(data.room==='adminTemlo' || data.room ==='ejecutivoTemlo'){
        const empresa = await temlo.find()
        const cargaOnline = {
            nombre:data.data.nombre,
            idEmpleado:data.data._id,
            nombreEmpresa:data.data.empresa,
            rol:data.data.rol,      
            nombreEmpresa:empresa[0].nombre,
            nit:empresa[0].nit,
            socket:data.idSocket
        }
        const on = new OnlineTEM(cargaOnline)
        const online = await on.save()
        if(online){
            return true
        }else{
            return {err:1,msg:'el empleado temlo no se establecio online'}
        }
    }
    if(data.room==='adminProveedor' || data.room ==='ejecutivoProveedor'){
        const empresa = await proveedores.find({_id:data.data.empresa})
        const cargaOnline = {
            nombre:data.data.nombreE+' '+data.data.primerApellidoE+' '+data.data.segundoApellidoE,
            idEmpleado:data.data._id,
            idEmpresa:data.data.empresa,
            rol:data.data.rol,      
            nombreEmpresa:empresa[0].nombreProveedor,
            nit:empresa[0].nitProveedor,
            socket:data.idSocket
        }
        const on = new OnlineP(cargaOnline)
        const online = await on.save()
        if(online){
            return true
        }else{
            return {err:1,msg:'el empleado proveedor no se establecio online'}
        }
    }
    if(data.room==='transportador'){
        const cargaOnline = {
                nombre:data.data.nombreE+' '+data.data.primerApellidoE +' '+data.data.segundoApellidoE,
                idEmpleado:data.data._id,
                rol:'transportador', 
                nombreEmpresa:'transportador',
                nit:'transportador',
                socket:data.idSocket
        }
        const on = new OnlineT(cargaOnline)
        const online = await on.save()
        if(online){
            return true
        }else{
            return {err:1,msg:'el transportador no se establecio online'}
        }
    }
    if(data.room==='Cliente'){
        const clienteOnline = await OnlineCLI.findOneAndUpdate({id:data._id},{socket:data.idSocket},{new: true})
        if(clienteOnline){
            return true
        }else{
            const cargaOnline = {
                nombre:data.nombre,
                rol:data.rol,
                id:data._id,
                socket:data.idSocket
            }
            const on = new OnlineCLI(cargaOnline)
            const online = await on.save()
            if(online){
                return true
            }else{
                return {err:1,msg:'el transportador no se establecio online'}
            }
        }
        
    }
}
f.cargarOffline = async(data)=>{
    if(data.room==='adminTemlo' || data.room ==='ejecutivoTemlo'){
        const quitar = await OnlineTEM.deleteOne({socket:data.idSocket})
        if(quitar){
            return true
        }else{
            return (false,{err:1,msg:'no se elimino de la bd conexion'})
        }
    }
    if(data.room==='adminProveedor' || data.room ==='ejecutivoProveedor'){
        const quitar = await OnlineP.deleteOne({socket:data.idSocket})
        if(quitar){
            return true
        }else{
            return (false,{err:2,msg:'no se elimino de la bd conexion'})
        }
    }
    if(data.room==='transportador'){
        const online = await OnlineT.deleteOne({socket:data.idSocket})
        if(online){
            return true
        }else{
            return (false,{err:3,msg:'no se elimino de la bd conexion'})
        }
    }
    if(data.room==='Cliente'){
        const online = await OnlineCLI.deleteOne({id:data._id})
        if(online){
            return true
        }else{
            return {err:1,msg:'no se elimino el cliente'}
        }
    }
}
f.cargarOfflineIdSocketAdminTemlo = async(data)=>{
    const online = await OnlineT.deleteOne({socket:data})
    if(online){
        return true
    }else{
        return {err:1,msg:'no se elimino el cliente'}
    }
}
f.cargarOfflineIdSocketAdminProveedor= async(data)=>{
    const online = await OnlineP.deleteOne({socket:data})
    if(online){
        return true
    }else{
        return {err:1,msg:'no se elimino el cliente'}
    }
}
f.cargarOfflineIdSocket = async(data)=>{
    const online = await OnlineCLI.deleteOne({socket:data})
    if(online){
        return true
    }else{
        return {err:1,msg:'no se elimino el cliente'}
    }
}
module.exports = f