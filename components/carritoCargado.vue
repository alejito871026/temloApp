<template>
  <div>
      <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="verCarrito">
            <div class="card-body">
                <div class="rounded text-center bg-primary text-white p-4"><h3><strong>Productos en el carrito</strong></h3></div> 
                <form @submit.prevent="pagar()">
                    <br>
                    <div v-if="espera" class="text-center">
                        <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                        <div class="alert alert-info">Por favor espere</div>
                    </div>
                    <div v-else>
                        <div class="card-body border border-primary mb-1 rounded" v-for="producto in productos" :key="producto._id">                            
                            <div class="">Producto: {{producto.nombreProducto}} {{producto.nombrePresentacion}}</div>
                            <div class="">Marca: {{producto.marca}}</div>
                            <div class="">Presentacion: {{producto.undPresentacion +' X '+producto.presentacionPorUnd}}</div>
                            <div class="" v-for="proveedor in producto.proveedores" :key="proveedor.IdProveedor">
                                <div class="">Comprado A: {{proveedor.nombreProveedor}}</div>
                                <table class="table table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th>Codigo</th>
                                            <th>Cantidad</th>
                                            <th>Precio unidad</th>
                                            <th>Total</th>
                                            <th>Borrar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>{{proveedor.codigoInterno}}</th>
                                            <td>
                                                <a class="btn border-primary btn-sm">{{proveedor.cantidad}}</a> 
                                                <div class="btn btn-outline-danger btn-sm bg-white" @click="EditarCantidad(proveedor, producto)"><strong><b-icon-pencil-square variant="danger" v-if="proveedor.cantidad<100"></b-icon-pencil-square></strong></div>
                                            </td>
                                            <td>{{proveedor.precioUnd}}</td>
                                            <td>{{proveedor.cantidad * proveedor.precioUnd}}</td>
                                            <td><div class="btn btn-outline-danger btn-sm bg-white" @click="eliminar(proveedor,producto)"><b-icon-x variant="danger"></b-icon-x></div></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-block btn-outline-info">Pagar</button>
                </form>
                <div class="btn btn-block btn-danger mt-2 " @click="estadoVerCarrito(false)"><h5><strong>Cerrar</strong></h5></div>
            </div>
        </b-modal>
        <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="editarCantidad">
            <div v-if="espera" class="text-center">
                <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                <div class="alert alert-info">Por favor espere</div>
            </div>
             <div class="p-4" v-else>
                <strong>Producto</strong>
                <div>{{valoresAcambiar.nombreProducto}}</div>
                <strong>Proveedor</strong>
                <div>{{valoresAcambiar.nombreP}}</div>
                <strong>Cantidad a comprar</strong><br>
                <div class="text-center p-2">
                    <div class="btn-group">
                        <div class="btn btn-sm btn-outline-primary" @click="valoresAcambiar.cantidad--" v-if="valoresAcambiar.cantidad>1"><b-icon-dash></b-icon-dash></div>
                        <div class="btn btn-sm btn-outline-primary" v-else><b-icon-dash></b-icon-dash></div>
                        <input type="number" min="1" class="btn btn-outline-primary" v-model.number="valoresAcambiar.cantidad">
                        <div class="btn btn-sm btn-outline-primary" @click="valoresAcambiar.cantidad++"><b-icon-plus></b-icon-plus></div>
                    </div>
                </div>
                <strong>Valor</strong>
                <div>{{multiplicarValor}}</div>
                <div class="btn btn-block btn-sm btn-outline-primary" @click="cambiarCantidad()">Cambiar cantidad</div>
                <div class="btn btn-block btn-sm btn-outline-warning" @click="editarCantidad=false, valoresAcambiar = {}">cerrar</div>
            </div>            
        </b-modal>
        <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header size="sm" v-model="aceptarEliminar">
            <div v-if="espera" class="text-center">
                <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                <div class="alert alert-info">Por favor espere</div>
            </div>
             <div class="p-4" v-else>
                <div class="card-title bg-primary text-center text-white p-3"><strong><h3>Eliminar del carrito</h3></strong></div>
                <div class="row">
                    <div class="col-sm-6"><strong>Producto:</strong></div>
                    <div class="col-sm-6">{{valoresAcambiar.nombreProducto}}</div>
                </div>
                <div class="row">
                    <div class="col-sm-6"><strong>Proveedor:</strong></div>
                    <div class="col-sm-6">{{valoresAcambiar.nombreP}}</div>
                </div>
                <div class="row">
                    <div class="col-sm-6"><strong>Cantidad a comprar:</strong></div>
                    <div class="col-sm-6">{{valoresAcambiar.cantidad}}</div>
                </div>
                <div class="row">
                    <div class="col-sm-6"><strong>Valor $:</strong></div>
                    <div class="col-sm-6">{{multiplicarValor}}</div>
                </div>
                <div class="btn btn-block btn-outline-primary mt-2" @click="eliminarOk()"><strong>Eliminar del carrito</strong></div>
                <div class="btn btn-block btn-outline-warning" @click="aceptarEliminar=false"><strong>Cerrar</strong></div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
    computed : {
        ...mapState('storeClientes',['verCarrito','carritoCargado']),
        multiplicarValor(){
            return this.valoresAcambiar.valUnd*this.valoresAcambiar.cantidad
        }, 
    },
    data(){
        return {
            espera:false,
            productos:this.$auth.$storage.getUniversal('carrito'),
            aceptarEliminar:false,
            editarCantidad :false,
            valoresAcambiar:{},
        }
    },
    methods:{
        ...mapMutations('storeClientes',['estadoVerCatalogoClientes','estadoVerCarrito','estadoCarritoCargado']),
        pagar(){
            
        },
        eliminar(proveedor,producto){
            this.aceptarEliminar=true
            console.log(proveedor)
            console.log(producto)
            this.valoresAcambiar = {
                idProducto:producto.idProducto,
                nombreProducto:producto.nombreProducto,
                nombreP:proveedor.nombreProveedor,
                cantidad:proveedor.cantidad,
                cantidad2:proveedor.cantidad,
                valUnd : proveedor.precioUnd,
                codigoInterno : proveedor.codigoInterno,
                cantTotal:proveedor.cantidadStock,
                proveedorId:proveedor.idProveedor,
                _id:proveedor._id,
            }
        },
        async eliminarOk(){
            this.espera=true
            let cantidad = this.valoresAcambiar.cantidad * -1
            const productoActualizado = await this.$axios.$post('/productos/actualizarStock',{_id:this.valoresAcambiar._id,cantidad})
            if(productoActualizado.success){
                await this.$store.dispatch('$nuxtSocket/emit', {
                    label: 'clientes', // Use persisted socket "mySocket"
                    evt: 'actualizarStock',
                    msg: {producto:this.valoresAcambiar}
                })
                let productos = []
                //buscamos el producto en el array del local storege y si existe actualizamos el array del localStorage primero ysalimos del ciclo sino ejecutamos lo que ya esta
                let prod = this.$auth.$storage.getUniversal('carrito')
                let produc = await prod.findIndex(el => el.idProducto === this.valoresAcambiar.idProducto) 
                console.log(produc)
                if(produc>=0){
                    console.log('entre por repetido el producto')
                    let proveedorExiste = await prod[produc].proveedores.findIndex(el => el.idProveedor === this.valoresAcambiar.proveedorId) 
                    if(proveedorExiste>=0){
                        console.log(prod[produc].proveedores.length+' uno')
                        prod[produc].proveedores.splice(proveedorExiste, 1);
                        console.log(prod[produc].proveedores.length+' dos')
                        if(prod[produc].proveedores.length<=0){
                            prod.splice(produc, 1);
                        }
                        this.$auth.$storage.setUniversal('carrito', prod)
                        this.productos=this.$auth.$storage.getUniversal('carrito'),
                        this.espera = false
                        this.aceptarEliminar = false
                        this.valoresAcambiar = {}
                        if(this.productos.length<=0){
                            this.$auth.$storage.removeUniversal('carrito')
                            this.estadoVerCarrito(false)
                            this.estadoCarritoCargado(false)
                        }
                    }                    
                }                      
            }
        },
        EditarCantidad(proveedor, producto){
            this.editarCantidad=true
            console.log(proveedor)
            console.log(producto)
            this.valoresAcambiar = {
                idProducto:producto.idProducto,
                nombreProducto:producto.nombreProducto,
                nombreP:proveedor.nombreProveedor,
                cantidad:proveedor.cantidad,
                cantidad2:proveedor.cantidad,
                valUnd : proveedor.precioUnd,
                codigoInterno : proveedor.codigoInterno,
                cantTotal:proveedor.cantidadStock,
                proveedorId:proveedor.idProveedor,
                _id:proveedor._id,
            }
        },
        cambiarCantidad(){
            this.espera = true
            if(this.valoresAcambiar.cantidad===this.valoresAcambiar.cantidad2 || this.valoresAcambiar.cantidad <= 0){
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Lo el valor escrito no es valido o no a cambiado!',
                })
                this.espera = false
                this.editarCantidad = false
                return
            }
            if(this.valoresAcambiar.cantidad<this.valoresAcambiar.cantidad2){
                this.actualizarStock(this.valoresAcambiar, 'restar')
            }
            if(this.valoresAcambiar.cantidad>this.valoresAcambiar.cantidad2){
                this.actualizarStock(this.valoresAcambiar, 'sumar')
            }
        },
        async actualizarStock(producto,operacion){
            let cantidad = 0
            if(operacion=='sumar'){
                cantidad = producto.cantidad - producto.cantidad2
                //validar si la nueva cantidad si esta en el stock
                const stock = await this.$axios.$post('/productos/validarStock',{_id:producto._id})
                if (stock>=cantidad){
                    const productoActualizado = await this.$axios.$post('/productos/actualizarStock',{_id:producto._id,cantidad})
                    if(productoActualizado.success){
                        await this.$store.dispatch('$nuxtSocket/emit', {
                            label: 'clientes', // Use persisted socket "mySocket"
                            evt: 'actualizarStock',
                            msg: {producto:producto}
                        })
                        let productos = []
                        //buscamos el producto en el array del local storege y si existe actualizamos el array del localStorage primero ysalimos del ciclo sino ejecutamos lo que ya esta
                        let prod = this.$auth.$storage.getUniversal('carrito')
                        let produc = await prod.findIndex(el => el.idProducto === producto.idProducto) 
                        console.log(produc)
                        if(produc>=0){
                            console.log('entre por repetido el producto')
                            let proveedorExiste = await prod[produc].proveedores.findIndex(el => el.idProveedor === producto.proveedorId) 
                            if(proveedorExiste>=0){
                                console.log('entre por repetido el proveedor')
                                prod[produc].proveedores[proveedorExiste].cantidad = producto.cantidad 
                            }
                            this.$auth.$storage.setUniversal('carrito', prod)
                            this.productos=this.$auth.$storage.getUniversal('carrito'),
                            this.espera = false
                            this.editarCantidad = false
                            this.valoresAcambiar = {}
                        }                      
                    } 
                }else{
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Stock en bodega: '+stock,
                        text: 'Lo sentimos el stock en bodega no alcanza para cumplir tu pedido!',
                    })
                    this.espera = false
                    return
                }   
            }
            if(operacion=='restar'){
                cantidad = producto.cantidad - producto.cantidad2
                const productoActualizado = await this.$axios.$post('/productos/actualizarStock',{_id:producto._id,cantidad})
                if(productoActualizado.success){
                    await this.$store.dispatch('$nuxtSocket/emit', {
                        label: 'clientes', // Use persisted socket "mySocket"
                        evt: 'actualizarStock',
                        msg: {producto:producto}
                    })
                    let productos = []
                    //buscamos el producto en el array del local storege y si existe actualizamos el array del localStorage primero ysalimos del ciclo sino ejecutamos lo que ya esta
                    let prod = this.$auth.$storage.getUniversal('carrito')
                    let produc = await prod.findIndex(el => el.idProducto === producto.idProducto) 
                    if(produc>=0){
                        console.log('entre por repetido el producto')
                        let proveedorExiste = await prod[produc].proveedores.findIndex(el => el.idProveedor === producto.proveedorId) 
                        if(proveedorExiste>=0){
                            console.log('entre por repetido el proveedor')
                            prod[produc].proveedores[proveedorExiste].cantidad = producto.cantidad 
                        }
                        this.$auth.$storage.setUniversal('carrito', prod)
                        this.productos=this.$auth.$storage.getUniversal('carrito'),
                        this.espera = false
                        this.editarCantidad = false
                    }                      
                }
            }
        }, 
    }
}
</script>

<style>

</style>