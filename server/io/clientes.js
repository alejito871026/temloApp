const f = require('../funcionesSocket/funcionesMVCsocketIO')
export default function(socket, io) { 
    return Object.freeze({
        async clienteConectado(data){
            data.idSocket = socket.id
            data.room = 'Cliente'
            let r = await f.cargarOnline(data)
            if(r){
                io.of('/adminTemlo').emit('clientes')
            }  
        },
        async salioCliente(data){
            data.idSocket = socket.id
            data.room = 'Cliente'
            let r = await f.cargarOffline(data)
            if(r){
                io.of('/adminTemlo').emit('clientes')
                return true
            }  
        },
        async actualizarStock(data){
            io.of('/clientes').emit('actualizarProducto',data) 
            io.of('/visitorsCatalogo').emit('actualizarProducto',data)
        },
        async salioClienteDisconect(){
            let r = await f.cargarOfflineIdSocket(socket.id)
            if(r){
                io.of('/adminTemlo').emit('clientes')
                return true
            } 
        },
        async disconnect(){
            let r = await f.cargarOfflineIdSocket(socket.id)
            if(r){
                io.of('/adminTemlo').emit('clientes')
                return true
            } 
        }
    })
}