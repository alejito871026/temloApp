const f = require('../funcionesSocket/funcionesMVCsocketIO.js')
    export default function(socket, io) { 
    return Object.freeze({
        async connected (data){
            let r = await f.cargarOnline({data: data.data, idSocket:socket.id,room:data.room})
            if(r){
                io.of('/adminTemlo').emit('conectadosProv')
            }            
        },
        async disconnect(){
            let d = await f.cargarOffline({idSocket:socket.id,room:'ejecutivoProveedor'})
            if(d){
                io.of('/adminTemlo').emit('conectadosProv')
            }
        },
    })
}