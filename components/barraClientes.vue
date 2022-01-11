<template>
    <div class="sticky-top">
        <b-navbar toggleable="lg" type="dark" variant="dark">            
            <div  class="btn nav-item text-center text-white" @click="estadoVerCatalogoClientes(true)">TEMLO.NET</div>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto"> 
                    <b-navbar-nav>
                        <div  class="btn nav-link text-center text-white" @click="estadoVerCatalogoClientes(true)">Catalogo</div>
                        <div  class="btn nav-link text-center text-white" @click="salir($auth.$state.user)">Cerrar sesion</div>
                    </b-navbar-nav>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div v-if="$auth.loggedIn" class="col-md-12 bg-dark text-white justify-content-end ">
            <div class="row">
                <div class="col-md-6 pb-2">
                    {{$auth.user.nombre}} &ensp;
                     <b-button v-b-popover.hover="'Aun no as agregado nada'" class="bg-dark btn-sm" v-if="!carritoCargado">
                        <b-icon-cart variant="warning" font-scale="1.5"></b-icon-cart>
                    </b-button>
                    <b-button v-b-popover.hover="'Ver compras'" class="bg-dark btn-sm" @click="estadoVerCarrito(true)" v-else>
                        <b-icon-cart variant="success" font-scale="1.5"></b-icon-cart>
                    </b-button>
                </div>
                <div class="col-md-6 pb-2">
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Buscar producto" @keyup="buscarProducto(productoBusquedaClientes)" v-model="productoBusquedaClientes"></b-form-input>
                </div>
            </div>
            <carrito-cargado v-if="verCarrito"/>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
    computed : {
        ...mapState('storeClientes',['productoClientesB','carritoCargado','verCarrito']),
    },
    data() {
        return {
            cantidad:0,
            productoBusquedaClientes:'',
            variable: new Boolean(),
        }
    },
    watch:{
        productoClientesB:function(n,o){
            if(n==null){
                this.productoBusquedaClientes=n
            }
        },
    },
    methods: {
        ...mapActions('storeClientes',['buscarProductoCliente']),
        ...mapMutations('storeClientes',['estadoVerCatalogoClientes','estadoVerCarrito']),
        ...mapMutations('storeInicioSesion',['estadoAbrirInicioSesion','estadoRegistroCliente']),
        buscarProducto(data){
            this.buscarProductoCliente(data)
        },  
        async salir(userr) {
            const r = await this.$store.dispatch('$nuxtSocket/emit', {
                    label: 'clientes',
                    evt: 'salioCliente',
                    msg: userr
                })
            if(r){
                this.$auth.$storage.removeUniversal('horaSalida')
                this.$auth.$storage.removeUniversal('carrito')
                this.$auth.logout()
                this.estadoAbrirInicioSesion(true)
                this.$router.push("/")
            }       
        },    
    },
}
</script>

<style>

</style>