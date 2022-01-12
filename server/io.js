const f = require('./funcionesSocket/funcionesMVCsocketIO.js')
export default function(socket, io) { 
    return Object.freeze({
        async disconnect(){
            let d = await f.eliminarRegistroCliente({idSocket:socket.id})
            console.log(d)
            if(d){
                console.log('se a eliminado el resgistro del cliente')
            }
        },
        async idSocket(){
            return socket.id
        },
        
    })
}
