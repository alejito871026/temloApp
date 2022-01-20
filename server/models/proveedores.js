const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProveedorSquema = new Schema({
    razonSocialProveedor: { type: String, required:[true,'Razon social obligatorio']},
    nombreProveedor: { type: String, required:[true,' obligatorio']},
    nitProveedor:{unique:true, type:String, required:[true,'Nit obligatorio']},
    telefonoProveedor: {type:Array, required:[true,'Cedula obligatorio']},
    direccionProveedor: { type: String, required:[true,'Contraseña obligatorio']},
    coordenadasProveedor:{type:Object},
    rutProveedor:{type:String },
    emailProveedor:{type:String, required:[true,'email obligatorio']},
    fechaAgregadoProveedor:{ type:Date, required:[true,'Fecha Agregado obligatorio']},
    editadoProveedor:{type:Boolean, default:false},
    sucursalesProveedor:{type:Boolean, default:false},
    editado:{type:Boolean, default:true},
    superAdmin:{type:Schema.Types.ObjectId, ref:'EmpleadoEP'}
});

module.exports = mongoose.model('Proveedor', ProveedorSquema);