<template>
    <div>
        <b-nav tabs>
            <b-nav-item active v-for="categoria in catt" :key="categoria._id" 
            @click="cargarSubCategoria(categoria._id)">
            {{categoria.nombreCategoria}}
            </b-nav-item >
        </b-nav>   
        <transition name="bounce" >
            <div v-if="mostrarSubCategorias" class="row border p-4" id="subcategorias" >
            <div class="p-2 mx-auto" v-for="subcategorias in subCategorias" :key="subcategorias._id">
                <b-collapse v-model="mostrarSubCategorias">   
                    <div class="btn" id="btnSubcategoria" @click="cargarProductos(subcategorias.nombreSubCategoria)">                
                    <strong>{{subcategorias.nombreSubCategoria}}</strong>
                    </div>            
                </b-collapse>
            </div>
            </div>
        </transition>       
        <br>
        <div  class="row p-3" v-if="productoBusquedaClientes.length>0">
            <div v-for="producto in productoBusquedaClientes" :key="producto._id" class="col-sm-4 mb-2 ">
                <producto-catalogo-clientes :product="producto" :keyId="keyid"/>
            </div> 
        </div>
        <div  class="row p-3" v-else>
            <div v-for="producto in productoss" :key="producto._id" class="col-sm-4 mb-2 ">
                <producto-catalogo-clientes :product="producto" :keyId="keyid" />
            </div>  
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
    computed:{
        ...mapState('storeCatalogo',['subCatt','catt']),
        ...mapState('storeClientes',['productoBusquedaClientes','actualizarProductoStock','idProducto','keyid','carritoCargado']),
    },
    watch : {
        actualizarProductoStock(n){
            if(n){
                this.estadoActualizarProductoStock({estado:false,data:{producto:{idProducto:this.idProducto}}})
                this.actualizarUnico()
            }
        }
    },
    async mounted(){
        if(this.catt.length<=0){
            this.crearCategoriass()
        }
        if(this.$auth.$storage.getUniversal('carrito')==undefined){
            this.estadoCarritoCargado(false)
        }else{
            this.estadoCarritoCargado(true)
        }   
    },
    data (){
        return {
            productoss:[],
            productosDos:[],
            categorias:[],
            idPresentacion:'',
            mostrarSubCategorias:false,
            subCategorias:[],
            infromacioncargada:{},
            presentacion:'',  
            productoAbuscar:'',
            sub:'',
        }
    },
    
    methods :{
        ...mapActions('storeCatalogo',['crearCategoriass']),
        ...mapActions('storeClientes',['buscarProductoCliente']),
        ...mapMutations('storeClientes',['cargarProductoBusquedaClientes','estadoProductoCliente','estadoActualizarProductoStock','estadoKeyid','estadoCarritoCargado']),
        async cargarSubCategoria(caat){
            this.mostrarSubCategorias = false      
            let r = this.subCatt.find(el => el.idCategoria === caat)
            this.subCategorias = r.subCategorias   
            setTimeout(() => {
                this.mostrarSubCategorias = true 
            }, 100);   
        },
        async cargarProductos(nombreSubcategoria){
            this.sub = nombreSubcategoria 
            this.productoss = []  
            this.productosDos = []
            const productoss = await this.$axios.$post('/productos/productosSub2',{nombreSubcategoria})
            this.productoss = productoss
            this.productosDos = productoss
            this.cargarProductoBusquedaClientes([])  
        },
        async actualizarUnico(){
            const producto = await this.$axios.$post('/productos/buscarInfoStockProducto',{_id:this.idProducto})
            if(producto){
                this.estadoKeyid(this.idProducto)
            }
        }
    }
}
</script>

<style>
#subcategorias {
    opacity: 0.7;
    background: linear-gradient( #5b076e, #b60682);
  }
  #btnSubcategoria {
    background:#5f0752;
    border: 3px solid #5f0780;
    color: white
  }
  .bounce-enter-active {
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

</style>