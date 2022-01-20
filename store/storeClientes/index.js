export const state = () => ({
    verCatalogoClientes : true,
    productoBusquedaClientes:[],
    productoClientesB:null,
    carritoCargado:false,
    actualizarProductoStock:false,
    idProducto:'',
    indexProducto:null,
    keyid:null,
    verCarrito:false,
    verMapaCarrito:false
})
export const getters= {

} 
export const mutations={
    estadoVerMapaCarrito(state,valor){
        state.verMapaCarrito = valor
    },
    estadoVerCarrito(state,valor){
        state.verCarrito = valor
    },
    estadoVerCatalogoClientes(state, valor){
        state.verCatalogoClientes = valor
    },
    cargarProductoBusquedaClientes(state, valor){
        state.productoBusquedaClientes = valor
    },
    estadoProductoCliente(state, valor){
        state.productoClientesB = valor
    },
    estadoCarritoCargado(state, valor){
        state.carritoCargado = valor
    },
    estadoActualizarProductoStock(state, valor){
        state.actualizarProductoStock = valor.estado
        state.idProducto = valor.data.producto.idProducto
    },
    estadoKeyid(state, valor){
        state.keyid = valor
    }
}
export const actions= {
    async buscarProductoCliente({state,commit},data){
        commit('estadoProductoCliente',data)
        let prod = state.productoClientesB
        if(prod.length>2){
            const productos = await this.$axios.$post("/productos/productoUnicoBarraHome",{prod})
            commit('cargarProductoBusquedaClientes',productos)
        }else{
            commit('cargarProductoBusquedaClientes',[])
            commit('estadoProductoCliente','')
        } 
    }  
}