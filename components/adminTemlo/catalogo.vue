<template>
    <div> 
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-toggle target="nav-collaps"></b-navbar-toggle>
            <b-collapse id="nav-collaps" is-nav>
                <b-navbar-nav class="ml-auto">
                    <ul class="navbar-nav ">
                    <li><input class="form-control" @keyup="buscarProducto()" v-model="productoAbuscar" placeholder="Buscar producto"></li>
                        <li class="btn text-white border border-primary sm" @click="crearProducto=true" v-if="!crearProducto">
                        Agregar producto al catalogo
                        </li>
                        <li class="btn text-white border border-primary sm" @click="crearProducto=false" v-if="crearProducto">
                        Cerrar agregar producto al catalogo
                        </li>
                        <!-- <li class="btn text-white border border-primary sm" @click="estadoCrearCategoria(true)" >
                        Agregar categoria al catalogo
                        </li>
                        <li class="btn text-white border border-primary sm" @click="estadoCrearSubCategoria(true)" >
                        Agregar sub-categoria al catalogo
                        </li> -->
                        <li class="btn text-white border border-primary sm" @click="estadoCrearMarca(true)" >
                        Agregar marca de productos
                        </li>
                    </ul>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>   
        <crear-categoria-productos v-if="crearCategoria"/>
        <crear-producto-catalogo v-if="crearProducto"/>
        <crear-sub-categoria-productos v-if="crearSubCategoria"/>
        <crear-marca-producto v-if="crearMarca"/>
        <div v-if="!crearProducto">
        <b-nav tabs>
            <b-nav-item active v-for="categoria in categorias" :key="categoria._id" 
            @mouseenter="cargarSubCategoria(categoria._id)">
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
        <div  class="row p-3">
            <div v-for="producto in productoss" :key="producto._id" class="col-sm-4 mb-2 ">
                <producto-catalogo :product="producto" />
            </div>  
        </div>    
        </div>
    </div> 
</template>

<script>
export default {

}
</script>

<style>

</style>