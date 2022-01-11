<template>
    <div>
        <div class="card p-2 text-center shadow">              
            <h3 class="card-title p-2">{{producto.nombreProducto}} <br>{{producto.nombrePresentacion}}</h3>
            <img :src="producto.imagen" :alt="producto.imagen" style="width:200px; height:200px" class="mx-auto">
            <h3 class="card-title p-2"> {{producto.marca}}</h3>
            <div class=""> 
                <div class="p-2">
                    <h6 class="d-flex justify-content-start">Presentacion:</h6>
                    <div class="mb-2">
                        {{producto.undPresentacion +' X '+producto.presentacionPorUnd}}
                    </div>
                    <h6 class="d-flex justify-content-start">Descripcion:</h6>
                    <div class="mb-2" v-bind:style="div1">
                        {{producto.descripcion}} <br>
                        <div class="btn border-bottom d-flex justify-content-end" @click="verMenos()" v-if="ver"><strong>ver menos...</strong></div>
                        <div class="btn border-bottom d-flex justify-content-end" @click="verMas()" v-else><strong>ver mas...</strong></div>
                    </div> 
                    <h6 class="d-flex justify-content-start">Ficha tecnica:</h6>
                    <div class="mb-2" v-bind:style="div3">
                        {{producto.fichaTecnica}} <br>
                        <div class="btn border-bottom d-flex justify-content-end" @click="verMenoss()" v-if="verr"><strong>ver menos...</strong></div>
                        <div class="btn border-bottom d-flex justify-content-end" @click="verMass()" v-else><strong>ver mas...</strong></div>
                    </div>  
                </div>                 
                Proveedores y precios:
                <table class="table table-hover table-sm">
                    <thead>
                        <tr>
                            <th>Proveedor</th>
                            <th>Precio</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody v-for="proveedore in proveedores.productos" :key="proveedore._id">
                        <tr>
                            <td>{{proveedore.idProveedor.nombreProveedor}}</td>
                            <td>{{proveedore.precio}}</td>
                            <td>{{proveedore.cantidadStock}}</td>
                            <td>
                                <b-button v-b-popover.hover="'Agregar al carrito'"  @click="comprarProducto(proveedore)" class="btn btn-danger btn-sm"><b-icon-cart-plus></b-icon-cart-plus></b-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- <div v-if="!proveedores.productos.length" class="alert alert-danger">Sin proveedores asignados</div> -->
            </div>
        </div>
        <b-modal v-model="modalParaLoguearse" centered no-close-on-backdrop no-close-on-esc hide-footer hide-header>
            <div class="p-4">
                <strong>Inicia sesion para poder comprar! Animate </strong>
                <br><br>
                <button class="btn btn-outline-success btn-block" @click="iniciarSesion()">Iniciar sesion</button>
                <div class="btn btn-outline-danger btn-block" @click="modalParaLoguearse=false">Cancelar</div>
            </div>
        </b-modal>
        <b-modal v-model="modalCantidad" centered no-close-on-backdrop no-close-on-esc hide-footer hide-header>
            <div class="p-4">
                <strong>Producto</strong>
                <div>{{p.nombreProducto}}</div>
                <strong>Proveedor</strong>
                <div>{{p.nombreP}}</div>
                <strong>Cantidad a comprar</strong><br>
                <div class="text-center p-2">
                    <div class="btn-group">
                        <div class="btn btn-sm btn-outline-primary" @click="p.cantidad--" v-if="p.cantidad>1"><b-icon-dash></b-icon-dash></div>
                        <div class="btn btn-sm btn-outline-primary" v-else><b-icon-dash></b-icon-dash></div>
                        <input type="number" min="1" :max="p.cantTotal" @keyup="validarMax()" class="btn btn-outline-primary" v-model.number="p.cantidad">
                        <div class="btn btn-sm btn-outline-primary" @click="p.cantidad++"><b-icon-plus></b-icon-plus></div>
                    </div>
                </div>
                <strong>Valor</strong>
                <div>{{multiplicarValor}}</div>
                <div class="btn btn-outline-primary btn-block" @click="comprar()">Comprar</div>
                <div class="btn btn-outline-danger btn-block" @click="modalCantidad=false">Cancelar</div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
    middleware: 'auth',
    props:['product','keyId'],
    computed : {
        ...mapState('storeCatalogo',['actualizarProductoStock','idProductoStock','keyid']),
        ...mapState('storeInicioSesion',['abrirInicioSesion']),
        multiplicarValor(){
            return this.p.valUnd*this.p.cantidad
        },
               
    },
    watch:{
        keyId(n){
            if(n===this.product._id){
                this.cargarProveedorProducto(n)
                this.estadoKeyid(null)
            }
        }
    },   
    data() {
        return {
            producto: {
                cantidad:1
            },
            proveedores:{
                productos:[]
            },
            info:{
                modal:false,
                detalle:''
            },
            div1:'padding: 6px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;',
            div2:'padding: 6px;',
            div3:'padding: 6px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;',
            div4:'padding: 6px;',
            divAuxiliar:'',
            divAuxiliar1:'',
            ver:false,
            verr:false,
            logueado:false,
            modalParaLoguearse:false,
            modalCantidad:false,
            p:{},
            carrito:[]
        }
    },
    mounted(){
        this.producto  = this.product
        this.cargarProveedorProducto(this.product._id)
    },
    methods: {
        ...mapMutations('storeCatalogo',['estadoAbrirInicioSesion','estadoCarritoCargado','estadoActualizarProductoStock','estadoKeyid']),
        ...mapMutations('storeInicioSesion',['estadoAbrirInicioSesion']),
        validarMax(){
            if(this.p.cantidad>this.p.cantTotal){
                this.p.cantidad = this.p.cantTotal
            }
        },
        verMas(){
            this.divAuxiliar = this.div1
            this.div1 = this.div2
            this.ver = true
        },
        verMenos(){
            this.div1 = this.divAuxiliar
            this.ver = false
        },
        verMass(){
            this.divAuxiliar1 = this.div3
            this.div3 = this.div4
            this.verr = true
        },
        verMenoss(){
            this.div3 = this.divAuxiliar1
            this.verr = false 
        },
        async cargarProveedorProducto(_id){
            this.proveedores = await this.$axios.$post('/productos/proveedoresPorProductoHome',{_id})
        },
        async comprarProducto(provee){
            if(this.$auth.loggedIn){
                this.modalCantidad = true
                this.estadoCarritoCargado(true)
                this.p = {
                    idProducto:provee.idProducto,
                    cantidad:1,
                    nombreProducto : this.producto.nombreProducto,
                    nombreP : provee.idProveedor.nombreProveedor,
                    valUnd : provee.precio,
                    cantTotal:provee.cantidadStock,
                    _id:provee._id,
                }
            }else{
                console.log('No esta logueado')
                this.modalParaLoguearse=true
            }
        },
        async comprar(){
            this.carrito.push(this.p)
            this.actualizarStock(this.p)
            this.modalCantidad = false
        },
        async actualizarStock(producto){
            const productoActualizado = await this.$axios.$post('/productos/actualizarStock',producto)
            if(productoActualizado.success){
                await this.$store.dispatch('$nuxtSocket/emit', {
                    label: 'home', // Use persisted socket "mySocket"
                    evt: 'actualizarStock',
                    msg: producto.idProducto
                })
            }
        },
        iniciarSesion(){
            this.estadoAbrirInicioSesion(true)
            this.modalParaLoguearse=false
        }
    },

}
</script>

<style>

</style>