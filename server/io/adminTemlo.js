
    const f = require('../funcionesSocket/funcionesMVCsocketIO.js')
    export default function(socket, io) { 
    return Object.freeze({  
        async connected (data){
            let r = await f.cargarOnline({data: data.data, idSocket:socket.id,room:data.room})
            if(r){
                io.of('/adminTemlo').emit('conectadosTemlo')
            }            
        },
        async disconnect(){
            let d = await f.cargarOffline({idSocket:socket.id,room:'adminTemlo'})
            if(d){
                io.of('/adminTemlo').emit('conectadosTemlo')
            }
        },
        async salioCliente(data){
            data.idSocket = socket.id
            data.room = 'adminTemlo'
            let r = await f.cargarOffline(data)
            if(r){
                io.of('/adminTemlo').emit('conectadosTemlo')
                return true
            }  
        },
        async salioEmpleadoDisconect(){
            let r = await f.cargarOfflineIdSocketAdminTemlo(socket.id)
            if(r){
                io.of('/adminTemlo').emit('conectadosTemlo')
                return true
            } 
        },
        //esta funcoin es de prueba para mirar el funcionamiento cunaso se usa el otro metodo de enviar peticiones al socket mor medios del dispatch 
        //al haber reutilizado el socket desde otra pagina o componente
        /* eliminando (data){
            console.log('data')
            console.log(data)
        } */
    })
}