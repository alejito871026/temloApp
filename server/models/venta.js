const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const VentaSquema = new Schema({
    cliente: { type:Schema.Types.ObjectId, ref:"Cliente", required:[true,"debes agregar el id del transportador primero"]},
    productos:{ type:Array, required:[true,"debes agregar de los Productos en esta venta primero"]},
    total:{ type:Number, required:[true,"el total debe ser automatico y es obligatorio"]},
    transporte:{ type:Schema.Types.ObjectId, ref:"Transporte", required:[true,"debes agregar el id del tranporte asignado a esta venta"]},
    estadoVenta:{type:String},
});

module.exports = mongoose.model('Venta', VentaSquema);