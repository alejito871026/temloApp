<template>
    <div>
        <b-nav tabs>
            <b-nav-item active v-for="categoria in cat" :key="categoria._id" 
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
        <div  class="row p-3" v-if="productoBusquedaHome.length>0">
            <div v-for="producto in productoBusquedaHome" :key="producto._id" class="col-sm-4 mb-2 ">
                <producto-catalogo-home :product="producto" :keyId="keyid"/>
            </div>  
        </div>
        <div  class="row p-3" v-else>
            <div v-for="producto in productoss" :key="producto._id" class="col-sm-4 mb-2 ">
                <producto-catalogo-home :product="producto" :keyId="keyid"/>
            </div>  
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
    computed:{
        ...mapState('storeCatalogo',['subCat','cat','productoBusquedaHome','keyid'])
    },
    async mounted(){   
        if(!this.$auth.loggedIn){ 
            this.socket = this.$nuxtSocket({
                name: 'temloApp.net',
                channel: '/visitorsCatalogo',
            })
            this.socket.emit('visitor')
            this.socket.on('actualizarProducto',(data)=>{
                this.actualizarUnico(data)
            })  
        }
        if(this.cat.length==0){
            this.crearCategorias()            
        }
    },
    
    data (){
        return {
            productos:[],
            productoss:[],
            productosDos:[],
            categorias:[],
            idPresentacion:'',
            mostrarSubCategorias:false,
            subCategorias:[],
            infromacioncargada:{},
            presentacion:'',  
            productoAbuscar:'',
        }
    },
    
    methods :{
        ...mapActions('storeCatalogo',['crearCategorias','buscarProductoHome']),
        ...mapMutations('storeCatalogo',['estadoCrearCategoria','estadoCrearSubCategoria','cargarProductoBusquedaHome','estadoProductoHome','estadoActualizarProductoStock','estadoKeyid']),
        async cargarSubCategoria(caat){
            this.mostrarSubCategorias = false      
            let r = this.subCat.find(el => el.idCategoria === caat)
            this.subCategorias = r.subCategorias   
            setTimeout(() => {
                this.mostrarSubCategorias = true 
            }, 100);   
        },
        async cargarProductos(nombreSubcategoria){
            this.cargarProductoBusquedaHome([])  
            this.estadoProductoHome(null)    
            let productoss = await this.$axios.$post('/productos/productosSub',{nombreSubcategoria})
            this.productoss = productoss
            this.productosDos = productoss
        },
        async actualizarUnico(data){
            const producto = await this.$axios.$post('/productos/buscarInfoStockProductoo',{_id:data.producto.idProducto})
            if(producto){
                this.estadoKeyid(producto._id)
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