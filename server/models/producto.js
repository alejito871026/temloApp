const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const ProductoSquema = new Schema({
    nombreProducto: { type:String}, 
    descripcion:{type:String},
    fichaTecnica:{type:String},
    subcategoria:{ type:String}, 
    marca:{type:String},
    imagen:{type:String},
    nombrePresentacion:{type:String},
    udps:{type:Array},
});
module.exports = mongoose.model('Producto', ProductoSquema);
