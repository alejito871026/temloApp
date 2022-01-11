const f = require('../funcionesSocket/funcionesMVCsocketIO.js')
export default function(socket, io) { 
    let visitante = 0
    return Object.freeze({
        visitor(){
            visitante=+1
            io.of('/adminTemlo').emit('visitantes')
        },
        disconnect(){
            visitante=-1
            io.of('/adminTemlo').emit('salioVisitante')
        },
    })
}
