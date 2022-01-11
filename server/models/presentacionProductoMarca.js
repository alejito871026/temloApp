const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const ProductoMarcaSquema = new Schema({
    idPresentacionProducto: {type:Schema.Types.ObjectId,ref:'ProductoMarca'}, 
    idMarca: { type:Object},  
    marca: { type:String}, 
    proveedores:{type:Array},
    rutaImagen: {type:String}
});
module.exports = mongoose.model('ProductoMarca', ProductoMarcaSquema);
