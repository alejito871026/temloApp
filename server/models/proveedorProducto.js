const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const proveedorProductoSquema = new Schema({
    idProveedor: {type:Schema.Types.ObjectId,ref:'Proveedor'}, 
    idProducto: {type:Schema.Types.ObjectId,ref:'Producto'}, 
    precio:{type:Number},
    cantidadStock:{type:Number},
    codigoInterno:{type:String},
    promocion:{
        porcentaje:{type:Number},
        fechaIncicio:{type:Date},
        fehcaFin:{type:Date}
    }
});
module.exports = mongoose.model('proveedorProducto', proveedorProductoSquema);