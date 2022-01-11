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
        ...mapState('storeClientes',['keyid']),
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
        }
    },
    mounted(){
        this.producto  = this.product
        this.cargarProveedorProducto(this.product._id)
    },
    methods: {
        ...mapMutations('storeClientes',['estadoCarritoCargado','estadoActualizarProductoStock','estadoKeyid']),
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
                this.p = {
                    idProducto:provee.idProducto,
                    cantidad:1,
                    nombreProducto : this.producto.nombreProducto,
                    nombrePresentacion : this.producto.nombrePresentacion,
                    marca : this.producto.marca,
                    undPresentacion : this.producto.undPresentacion,
                    presentacionPorUnd : this.producto.presentacionPorUnd,
                    nombreP : provee.idProveedor.nombreProveedor,
                    valUnd : provee.precio,
                    codigoInterno : provee.codigoInterno,
                    cantTotal:provee.cantidadStock,
                    proveedorId:provee.idProveedor._id,
                    _id:provee._id,                    
                }
            }
        },
        async comprar(){
            this.estadoCarritoCargado(true)
            this.actualizarStock(this.p)
            this.modalCantidad = false
        },
        async actualizarStock(producto){
            console.log(producto)
            const productoActualizado = await this.$axios.$post('/productos/actualizarStock',producto)
            const index = this.indexx
            if(productoActualizado.success){
                await this.$store.dispatch('$nuxtSocket/emit', {
                    label: 'clientes', // Use persisted socket "mySocket"
                    evt: 'actualizarStock',
                    msg: {producto:producto}
                })
                let productos = []
                //buscamos el producto en el array del local storege y si existe actualizamos el array del localStorage primero ysalimos del ciclo sino ejecutamos lo que ya esta                
                if(this.$auth.$storage.getUniversal('carrito')){ 
                    let prod = this.$auth.$storage.getUniversal('carrito')
                    let produc = await prod.findIndex(el => el.idProducto === producto.idProducto) 
                    console.log(produc)
                    if(produc>=0){
                        console.log('entre por repetido el producto')
                        let proveedorExiste = await prod[produc].proveedores.findIndex(el => el.idProveedor === producto.proveedorId) 
                        if(proveedorExiste>=0){
                            console.log('entre por repetido el proveedor')
                            prod[produc].proveedores[proveedorExiste].cantidad = prod[produc].proveedores[proveedorExiste].cantidad + producto.cantidad 
                        }else{
                            console.log('entre por proveedor nuevo')
                            const proveedor = {
                                idProveedor : producto.proveedorId,
                                cantidad : producto.cantidad,
                                precioUnd : producto.valUnd,
                                nombreProveedor : producto.nombreP,
                                codigoInterno : producto.codigoInterno,
                                _id:producto._id
                            } 
                            prod[produc].proveedores.push(proveedor)
                        }
                        this.$auth.$storage.setUniversal('carrito', prod)
                    }else{
                        productos = this.$auth.$storage.getUniversal('carrito')
                        let produ = {
                            idProducto : producto.idProducto, 
                            nombreProducto : producto.nombreProducto,
                            proveedores : [],
                            nombrePresentacion:producto.nombrePresentacion,
                            marca:producto.marca,
                            undPresentacion:producto.undPresentacion,
                            presentacionPorUnd:producto.presentacionPorUnd,
                        }
                        const proveedor = {
                            idProveedor : producto.proveedorId,
                            cantidad : producto.cantidad,
                            precioUnd : producto.valUnd,
                            nombreProveedor : producto.nombreP,
                            codigoInterno : producto.codigoInterno,
                            _id:producto._id
                        } 
                        produ.proveedores.push(proveedor)
                        console.log('entra por nuevo seria un nuevo item ')
                        productos.push(produ)
                        this.$auth.$storage.setUniversal('carrito', productos)
                    }
                }else{
                    console.log(producto)
                    let produ = {
                        idProducto : producto.idProducto, 
                        nombreProducto : producto.nombreProducto,
                        proveedores : [],
                        nombrePresentacion:producto.nombrePresentacion,
                        marca:producto.marca,
                        undPresentacion:producto.undPresentacion,
                        presentacionPorUnd:producto.presentacionPorUnd,
                    }
                    const proveedor = {
                        idProveedor : producto.proveedorId,
                        cantidad : producto.cantidad,
                        precioUnd : producto.valUnd,
                        nombreProveedor : producto.nombreP,
                        codigoInterno : producto.codigoInterno,
                        _id:producto._id
                    } 
                    produ.proveedores.push(proveedor)
                    console.log('entra por nuevo sin haber carrito seria el primer producto')
                    productos.push(produ)
                    this.$auth.$storage.setUniversal('carrito', productos)
                }
                
            }
        },
    },

}
</script>

<style>

</style>