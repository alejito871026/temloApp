<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-toggle target="nav-collaps"></b-navbar-toggle>
        {{$auth.user}}
        <b-collapse id="nav-collaps" is-nav>
            <b-navbar-nav class="ml-auto">
                <ul class="navbar-nav ">
                  <li><input class="form-control" @keyup="buscarProducto()" v-model="productoAbuscar" placeholder="Buscar producto"></li>
                    <li class="btn text-white border border-primary sm" @click="productosOk()">
                      Productos vendidos
                    </li>
                    <li class="btn text-white border border-primary sm" @click="productosNo()">
                      Productos no vendidos
                    </li>
                </ul>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
      <div v-if="!productosSi">
        <div class=" card" v-for="producto in productos" :key="producto._id">
          <div class="row">
            <div class="col-xl-2 text-center">
              <b-avatar :src="producto.imagen" size="6rem" rounded></b-avatar>
            </div>
            <div class="col-xl-6">
              {{producto.nombreProducto }}
              {{ producto.nombrePresentacion}}
              {{ producto.marca}}
              {{ producto.descripcion}} 
            </div>
            <div class="col-xl-4">
              <div v-if="producto.udps[0]!=null">
                <div class="btn btn-outline-success">Dejar de vender</div>
              </div>
              <div class="btn btn-outline-success" v-else @click="modalAsignacion(producto)">Vender producto</div>
            </div>
          </div>        
        </div>
        <nav>
            <br>
            <ul class="pagination justify-content-center d-flex">
                <li class="page-item"><div class="page-link" v-if="parPage>0" @click="cambiarPagina(parPage=parPage-1)" >Anterior</div></li>
                <li class="page-item" v-for="pagina in paginas" :key="pagina">
                    <div class="page-link" @click="cambiarPagina(parPage=pagina)">{{pagina}}</div>
                </li>
                <li class="page-item"><div class="page-link" v-if="parPage<paginas.length" @click="cambiarPagina(parPage=parPage+1)">Siguiente</div></li>
            </ul>
        </nav>
      </div>
      <div v-else>
        <div class=" card" v-for="producto in productosVenta" :key="producto._id">
          <div class="row">
            <div class="col-xl-2 text-center">
              <b-avatar :src="producto.idProducto.imagen" size="6rem" rounded></b-avatar>
            </div>
            <div class="col-xl-6">
              {{producto.idProducto._id}}
              {{producto.idProducto.nombreProducto }}
              {{ producto.idProducto.nombrePresentacion}}
              {{ producto.idProducto.marca}}
              {{ producto.idProducto.descripcion}}
            </div>
            <div class="col-xl-4">
              <div class="btn btn-outline-success">Dejar de vender</div>
            </div>
          </div>       
        </div>
        <nav>
            <br>
            <ul class="pagination justify-content-center d-flex">
                <li class="page-item"><div class="page-link" v-if="parPageProductosVentas>0" @click="cambiarPaginaProductosVentas(parPageProductosVentas=parPageProductosVentas-1)" >Anterior</div></li>
                <li class="page-item" v-for="pagina in paginasProductosVentas" :key="pagina">
                    <div class="page-link" @click="cambiarPaginaProductosVentas(parPageProductosVentas=pagina)">{{pagina}}</div>
                </li>
                <li class="page-item"><div class="page-link" v-if="parPageProductosVentas<paginasProductosVentas.length" @click="cambiarPaginaProductosVentas(parPageProductosVentas=parPageProductosVentas+1)">Siguiente</div></li>
            </ul>
        </nav>
      </div>
      <b-modal centered no-close-on-backdrop no-close-on-esc hide-footer hide-header v-model="modalAsignacionVenta">
        <div class="card">
          <div class="card-header bg-primary text-center">
            <h3 class="card-title text-white">{{prodAsignar.nombreProducto}} {{prodAsignar.nombrePresentacion}} </h3>
          </div>
          <div class="card-body">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text">Precio</label>
              </div>
              <input type="number" class="form-control" v-model="valores.precio" >
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text">Cantidad stock</label>
              </div>
              <input type="number" class="form-control" v-model="valores.cantidadStock" >
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text">Codigo interno producto</label>
              </div>
              <input type="text" class="form-control" v-model="valores.codigoInterno" >
            </div>
          </div>
          <div class="card-footer bg-white">
            <div class="btn btn-outline-primary btn-block" @click="asignacionAproducto(prodAsignar._id,valores)">Guardar datos</div>
            <div class="btn btn-block btn-outline-warning" @click="cerrarAsignacion()">Cerrar asignacion</div>
          </div>          
        </div>        
    </b-modal>
  </div>
</template>
<script>
export default {
  mounted() {
    //this.linkImagenes()
    this.verProductosVentas()
    this.paginacion()
  },
  data() {
    return {
      productos: [],
      productosDos : [],
      productosVenta : [],
      paginas:[],     
      parPage:0, 
      paginasProductosVentas:[],    
      parPageProductosVentas:0,
      productoAbuscar:'',
      productosSi:false,
      modalAsignacionVenta:false,
      prodAsignar:{},
      valores:{},
      vendidos:[],
      productosAuxiliar:{},
    };
  },
  methods: {
    modalAsignacion(producto){
      this.prodAsignar = producto
      this.modalAsignacionVenta=true
    },
    cerrarAsignacion(){
      this.modalAsignacionVenta=false
    },
    async asignacionAproducto(producto,valores) {
      let data = {
        idProducto:producto,
        idProveedor:this.$auth.user.idEmpresa,
        precio:valores.precio,
        cantidadStock:valores.cantidadStock,
        codigoInterno:valores.codigoInterno,        
      }
       const asignacionProducto = await this.$axios.$post('/productos/asignacion',data)
       console.log(asignacionProducto)
       if(asignacionProducto.success){
         this.modalAsignacionVenta=false
         this.valores = {}
         this.prodAsignar = {}
         console.log(this.productoAbuscar.length)
         if(this.productoAbuscar.length>0){
           this.buscarProducto()
         }
       }else{
         console.log(asignacionProducto)
       }
    },
    /* async linkImagenes(){
      let productos = await this.$axios.$post('/productos/productosss')
      console.log(productos)
      for (let a = 0; a < productos.length; a++) {
        const imagen = 'server/imgUploadsProducts/'+productos[a].imagen;
        const _id = productos[a]._id
        console.log(imagen)
        const cambiarLink = await this.$axios.$post('/productos/productosssL',{imagen,_id})    
        console.log(cambiarLink)   
      }
    }, */
    async verProductos(vendidos) {
      let pagina = this.parPage
      let id = this.$auth.user.idEmpresa
      let productos = await this.$axios.$post('/productos/productosNo',{pagina,id,vendidos})
      if(productos.status!=200){  
          if(productos.status === 205){
              alert('El token a vencido o no existe')
              this.$auth.logout()
              this.$router.push("/inicioSesion")
          }else{
              alert('Ocurio un error en la validacion del token')
              this.$auth.logout()
              this.$router.push("/inicioSesion")
          }
      }else{
          this.productosDos = productos.productos
          this.productos = productos.productos
      }
    },
    async paginacion(){
        let id = this.$auth.user.idEmpresa
        let vendidos = this.vendidos
        let paginas = await this.$axios.$post("/productos/totalProductosNo",{id,vendidos})
        let totalPaginas = Math.ceil(paginas / 5)
        for(let a = 1;a<=totalPaginas-1;a++){
            this.paginas.push(a)
        }
    },
    async cambiarPagina (pagina) {
      this.productosAuxiliar = {}
        const pag = {
            pagina,
            id : this.$auth.user.idEmpresa,
            vendidos:this.vendidos
        }
        let productos = await this.$axios.$post("/productos/productosNo", pag)
        if(productos.success===false){  
            if(productos.status === 205){
                alert('El token a vencido o no existe')
                this.$auth.logout()
            }else{
                alert('Ocurio un error en la validacion del token')
                this.$auth.logout()
            }
            this.$router.push('/inicioSesion')
        }else{
            this.productos = productos.productos
            this.productosAuxiliar = productos.productos
        }
    },
    async verProductosVentas() {
      let pagina = 0
      let id = this.$auth.user.idEmpresa
      let productos = await this.$axios.$post('/productos/productosSi',{pagina,id})
      if(productos.status!=200){  
          if(productos.status === 205){
              alert('El token a vencido o no existe')
              this.$auth.logout()
              this.$router.push("/inicioSesion")
          }else{
              alert('Ocurio un error en la validacion del token')
              this.$auth.logout()
              this.$router.push("/inicioSesion")
          }
      }else{
          //this.cambiarPagina(pagina)
          this.productosDosVentas = productos.productos
          this.productosVenta = productos.productos
          for (let i = 0; i < productos.productos.length; i++) {
            this.vendidos.push(productos.productos[i].idProducto._id);            
          }
          this.verProductos(this.vendidos);
      }
    },
    async paginacionProductosVentas(){
        let id = this.$auth.user.idEmpresa
        let paginas = await this.$axios.$post("/productos/totalProductosSi",{id})
        let totalPaginas = Math.ceil(paginas / 5)
        for(let a = 1;a<=totalPaginas-1;a++){
            this.paginasProductosVentas.push(a)
        }
    },
    async cambiarPaginaProductosVentas (pagina) {
        const pag = {
            pagina,
            id : this.$auth.user.idEmpresa
        }
        let productos = await this.$axios.$post("/productos/productosSi", pag)
        console.log(productos.productos)
        if(productos.success===false){  
            if(productos.status === 205){
                alert('El token a vencido o no existe')
                this.$auth.logout()
            }else{
                alert('Ocurio un error en la validacion del token')
                this.$auth.logout()
            }
            this.$router.push('/inicioSesion')
        }else{
            this.productosVenta = productos.productos
        }
    },
    async buscarProducto(){     
        let prod = this.productoAbuscar
        if(prod.length>2){
          let idProveedor = this.$auth.user.idEmpresa
          this.productos = await this.$axios.$post("/productos/productoUnico",{prod,idProveedor})
        }else{
          if(prod.length<1){
            this.cambiarPagina(this.parPage)
          }
        }      
    },
    async productosNo(){
      this.productosSi = false
    },
    async productosOk(){
      this.productosSi = true
      this.paginacionProductosVentas()
    }
  },
};
</script>

<style>
</style>