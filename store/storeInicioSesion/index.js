export const state = () => ({
    cambiarContrasena:false,
    abrirInicioSesion:false,
    abrirRegistro:false,
    abiertoDesdeInicioSesion:false,
    idSocket:''
})
export const getters= {

} 
export const mutations={
    estadoIdSocket(state, valor){
        state.idSocket = valor
    },
    estadoCambiarContrasena(state,valor){
        state.cambiarContrasena = valor
    },
    estadoAbrirInicioSesion(state, valor){
        state.abrirInicioSesion = valor
    },
    estadoRegistroCliente(state, valor){
        state.abrirRegistro = valor
    },
    estadoRegistroAbrir(state,valor){
        state.abiertoDesdeInicioSesion = valor
    },
}

export const actions= {
    
}