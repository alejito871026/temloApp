const express = require('express');
const router = express.Router();
const authe = require('../middlewares/midAuth.js')
const categorias = require('../models/categoriasProductos.js')
const subCategorias = require('../models/subCategoriasProductos.js')
const marcas = require('../models/MarcasProductos.js')
const producto = require('../models/producto.js')
const provedores = require('../models/proveedores.js')
const proveedorProducto = require('../models/proveedorProducto.js')

/* router.post('/subCategoriasnnn',authe, async (req, res) => {
    console.log(req.body)
    let sub = new subCategorias(req.body)
    const subCategoria  = await sub.save()
    res.json(subCategoria)
}) */

router.post('/verProductosnb',authe, async (req, res) => {
    let Productos  = await provedores.find()
    res.json(Productos)
})
router.post('/productosSub', async (req, res) => {
    let Productos  = await producto.find({subcategoria:req.body.nombreSubcategoria}).sort({nombreProducto:1})
    res.json(Productos)
})
router.post('/productosSub2', authe, async (req, res) => {
    let Productos  = await producto.find({subcategoria:req.body.nombreSubcategoria}).sort({nombreProducto:1})
    res.json(Productos)
})
router.post('/productoUnico',authe, async (req, res) => {
    let $regex =  new RegExp(req.body.prod, "i")
    let Productos  = await producto.find({"nombreProducto":{$regex}})
    for(let i = 0; i < Productos.length; i++){
        let siVendoProducto = await proveedorProducto.find({idProducto:Productos[i]._id,idProveedor:req.body.idProveedor})
        Productos[i].udps.push(siVendoProducto[0])
    }
    res.json(Productos)       
})
router.post('/productoUnicoCatalogoAdmin',authe, async (req, res) => {
    let $regex =  new RegExp(req.body.prod, "i")
    let Productos  = await producto.find({"nombreProducto":{$regex}})
    res.json(Productos)       
})
router.post('/productoUnicoBarraHome', async (req, res) => {
    let $regex =  new RegExp(req.body.prod, "i")
    let Productos  = await producto.find({"nombreProducto":{$regex}})
    res.json(Productos)       
})
router.post('/proveedoresPorProducto',authe, async (req, res) => {    // Para la página 1, el salto es: (0) * 20 => 0 * 20 = 0
    const productos = await proveedorProducto.find({idProducto:req.body._id}).populate('idProveedor')
    if(productos){
        return res.status(200).json({
            productos,
            success:true,
            status:200
        })
    }
})
router.post('/proveedoresPorProductoHome', async (req, res) => {    // Para la página 1, el salto es: (0) * 20 => 0 * 20 = 0
    const productos = await proveedorProducto.find({idProducto:req.body._id}).populate('idProveedor')
    if(productos){
        return res.status(200).json({
            productos,
            success:true,
            status:200
        })
    }
})
//Soluciones plásticas,Maderas y Tableros,Seguridad->Soluciones plásticas
//estas 2 funciones siguientes son para prganizar el lin de las imagenes
/* router.post('/productosss',authe, async (req, res) => {
    const productos = await producto.find()
    if(productos){
        res.status(200).json(productos)
    }
})
router.post('/productosssL',authe, async (req, res) => {
    let ok = await  producto.updateOne({_id:req.body._id},{imagen:req.body.imagen})
    res.json({
        id:ok._id,
        success:true
    })
}) */
router.post('/productosNo',authe, async (req, res) => {
    let page = (req.body.pagina)  
    let pageSize = 5                   // Similar a 'límite'
    const skip = (page) * pageSize;        // Para la página 1, el salto es: (0) * 20 => 0 * 20 = 0
    //const productos = await producto.find({proveedoresProducto:{$not:{$eq:req.body.id}}}).sort({_id:-1}).skip(skip).limit(5)
    const productos = await producto.find({_id:{$nin:req.body.vendidos}}).sort({_id:-1}).skip(skip).limit(5)
    if(productos){
        return res.status(200).json({
            productos,
            success:true,
            status:200
        })
    }
})
router.post('/totalProductosNo',authe, async (req, res)=>{
    let total = await producto.find({_id:{$nin:req.body.vendidos}}).countDocuments()
    res.json(total)
})
router.post('/productosSi',authe, async (req, res) => {
    let page = (req.body.pagina)  
    let pageSize = 5                   // Similar a 'límite'
    const skip = (page) * pageSize;        // Para la página 1, el salto es: (0) * 20 => 0 * 20 = 0
    const productos = await proveedorProducto.find({idProveedor:req.body.id}).sort({_id:-1}).skip(skip).limit(5).populate('idProducto')
    if(productos){
        return res.status(200).json({
            productos,
            success:true,
            status:200
        })
    }
})
router.post('/totalProductosSi',authe, async (req, res)=>{
    let total = await proveedorProducto.find({proveedoresProducto:req.body.id}).countDocuments()
    res.json(total)
})
router.post('/guardarProducto', async (req, res) => {
    let product = new producto(req.body)
    const ok = await product.save()
    res.json({
            id:ok._id,
            success:true
    })  
})
router.post('/asignacion', async (req, res) => {
    console.log(req.body)
    try {
        const asignacion = new proveedorProducto(req.body)
        const asignado = await asignacion.save()
        if(asignado){
            res.status(200).json({success:true})
        }
    } catch (error) {
        console.log(error)
        res.status(205).json({error})
    }
})
/* router.post('/guardarPresentacionProducto',authe,  async (req, res) => {
    let presentacion = new presentacionProducto(req.body)//falta acomodar los objetos antes de enviarlos
    const ok = await presentacion.save()
    res.json({
        id:ok._id,
        success:true
    })
}) */
/* router.post('/guardarPresentacionPorMarca',authe, async (req, res) => {
    console.log(req.body)
    let presentacionMarca = new presentacionProductoMarca(req.body)
    const ok = await presentacionMarca.save()
    console.log(ok)
    res.json({
        id:ok._id,
        success:true
    })
})
router.post('/updatePresentacionProducto',authe, async (req, res) => {
    console.log(req.body)
    let ok = await  presentacionProducto.updateOne({
        _id:req.body._id},{$push:{idPresentacionesMarca:req.body.id}
    })
    console.log(ok)
    res.json({
        id:ok._id,
        success:true
    })
}) */
router.post('/updateProducto',authe, async (req, res) => {
    let ok = await  producto.updateOne({
        _id:req.body._id},{$push:{idPresentaciones:req.body.idPresentaciones}
    })
    res.json({
        id:ok._id,
        success:true
    })
})
router.post('/subCategorias',authe, async (req, res) => {
    const subCategoria  = await subCategorias.find({idCategoria:req.body.categoria}).sort({nombreSubCategoria:1})
    res.json(subCategoria)
})
router.get('/categorias',authe, async (req, res) => {
    const Categoria  = await categorias.find().sort({nombreCategoria:1})
    res.json(Categoria)
}) 
router.get('/categorias2', async (req, res) => {
    const Categoria  = await categorias.find().sort({nombreCategoria:1})
    res.json(Categoria)
})
router.post('/subCategorias2', async (req, res) => {
    const subCategoria  = await subCategorias.find({idCategoria:req.body.categoria}).sort({nombreSubCategoria:1})
    res.json(subCategoria)
})
router.post('/marcas',authe, async (req, res) => {
    let $regex =  new RegExp(req.body.marca, "i")
    let Marcas  = await marcas.find({"marca":{$regex}})
    res.json(Marcas)
})
router.post('/guardarMarca', authe, async (req, res)=>{
    const Marca = new marcas(req.body)
    const marcaOk = await Marca.save()
    res.json(marcaOk)
})
router.post('/guardarCategoria', authe, async (req, res)=>{
    const categoria = new categorias(req.body.cat)
    const categoriaOk = await categoria.save()
    res.json(categoriaOk)
})
router.post('/guardarSubCategoria', authe, async (req, res)=>{
    const SUBcategoria = new subCategorias(req.body.cat)
    const categoriaOk = await SUBcategoria.save()
    res.json(categoriaOk)
})
router.post('/validarStock', authe, async (req, res)=>{
    const stock = await proveedorProducto.findOne({_id:req.body._id})
    if(stock){
        res.json(stock.cantidadStock)
    }
})
router.post('/actualizarStock', authe, async (req, res)=>{
    const updateOk = await proveedorProducto.updateOne({_id:req.body._id},{$inc:{cantidadStock:-req.body.cantidad}})
    if(updateOk){
        res.json({
            success:true,
            status:200
        })
    }
})
router.post('/buscarInfoStockProducto', authe, async (req, res)=>{
    const productoOk = await producto.findOne({_id:req.body._id})
    if(productoOk){
        res.json(productoOk)
    }
})
router.post('/buscarInfoStockProductoo', async (req, res)=>{
    const productoOk = await producto.findOne({_id:req.body._id})
    if(productoOk){
        res.json(productoOk)
    }
})

module.exports = router;
