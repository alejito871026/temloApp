export const state = () => ({
    crearCategoria :false,
    crearSubCategoria:false,
    actualizarCategorias:false,
    actualizarSubCategorias:false,
    id:false,
    crearMarca:false,
    actualizarMarcas:false,
    subCat:[],
    cat:[],
    subCatt:[],
    catt:[],
    productoBusquedaHome : [],
    productoHomeB : null,
    actualizarProductoStock:false,
    idProducto:'',
    keyid:null
})
export const getters= {

} 
export const mutations={
    estadoCrearCategoria(state,valor){
        state.crearCategoria = valor
    },
    estadoActualizarCategorias(state,valor){
        state.actualizarCategorias = valor
    },
    estadoCrearSubCategoria(state,valor){
        state.crearSubCategoria = valor
    },
    estadoActualizarSubCategorias(state,valor){
        state.actualizarSubCategorias = valor
    },
    estadoId(state,valor){
        state.id = valor
    },
    estadoCrearMarca(state,valor){
        state.crearMarca = valor
    },
    estadoActualizarMarcas(state,valor){
        state.actualizarMarcas = valor
    },
    cargarSubCat(state, valor){
        state.subCat.push(valor)
    },
    cargarCat(state, valor){
        state.cat = valor
    },
    cargarSubCatt(state, valor){
        state.subCatt.push(valor)
    },
    cargarCatt(state, valor){
        state.catt = valor
    },
    cargarProductoBusquedaHome(state, valor){
        state.productoBusquedaHome = valor
    },
    estadoProductoHome(state, valor){
        state.productoHomeB = valor
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
    async crearCategorias({commit}){
        const categorias = await this.$axios.$get('/productos/categorias2')
        commit('cargarCat',categorias)
        for (let a = 0; a < categorias.length; a++) {
            let categoria = categorias[a]._id
            let data = {
                idCategoria : categorias[a]._id,
                subCategorias : {}
            }
            const subCategorias = await this.$axios.$post('/productos/subCategorias2',{categoria})
            data.subCategorias = subCategorias
            commit('cargarSubCat',data)          
        }
        
    },
    async crearCategoriass({commit}){
        const categorias = await this.$axios.$get('/productos/categorias')
        if(categorias){
            commit('cargarCatt',categorias)
            for (let a = 0; a < categorias.length; a++) {
                let categoria = categorias[a]._id
                let data = {
                    idCategoria : categorias[a]._id,
                    subCategorias : {}
                }
                const subCategorias = await this.$axios.$post('/productos/subCategorias',{categoria})
                data.subCategorias = subCategorias
                commit('cargarSubCatt',data)          
            }
        }
        
    }, 
    async buscarProductoHome({state,commit},data){
        commit('estadoProductoHome',data)
        let prod = state.productoHomeB
        if(prod.length>2){
            const productos = await this.$axios.$post("/productos/productoUnicoBarraHome",{prod})
            commit('cargarProductoBusquedaHome',productos)
        }else{
            commit('cargarProductoBusquedaHome',[])
            commit('estadoProductoHome','')
        } 
    }  
}