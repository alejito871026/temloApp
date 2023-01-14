export const state = () => ({
    verProveedor:false,
    agregarEjecutivoTemlo :false,
    verEjecutivos:true,
    ejecutivoAeditar:false,
    agregarTransportador : false,
    verTransportadores : true,
    agregarVehiculo:false,
    verVehiculos:true,
    verTiposVehiculos:false,
    transportadorAeditar:false,
    actualizarTablaTransportadores:false
})
export const getters= {

} 
export const mutations={
    estadoVerProveedor(state,valor){
        state.verProveedor = valor
    },
    estadoAgregarEjecutivoTemlo(state,valor){
        state.agregarEjecutivoTemlo = valor
    },
    estadoVerEjecutivos(state,valor){
        state.verEjecutivos = valor
    },
    estadoEjecutivoAeditar (state,valor){
        state.ejecutivoAeditar = valor
    },

    estadoAgregarTransportador(state, valor){
        state.agregarTransportador = valor
    },
    estadoActualizarTablaTransportadores(state, valor){
        state.actualizarTablaTransportadores = valor
    },
    estadoTransportadorAeditar (state,valor){
        state.transportadorAeditar = valor
    },

    estadoAgregarVehiculo(state, valor){
        state.agregarVehiculo = valor
    },
    estadoVerVehiculos(state, valor){
        state.verVehiculos = valor
    },
    estadoVerTiposVehiculos(state, valor){
        state.verTiposVehiculos = valor
    },
}

export const actions= {
    
}