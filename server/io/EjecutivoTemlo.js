export default function(socket, io) { 
    return Object.freeze({
        async connected (data){
            let r = await f.cargarOnline({data: data.data, idSocket:socket.id,room:data.room})
            if(r){
                io.of('/adminTemlo').emit('conectadosTemlo')
            }            
        },
        async disconnect(){
            let d = await f.cargarOffline({idSocket:socket.id,room:'ejecutivoTemlo'})
            if(d){
                io.of('/adminTemlo').emit('conectadosTemlo')
            }
        },
    })
}