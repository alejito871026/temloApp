const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const onlineProveedorSquema = new Schema({
    nombre:{type:String},
    idEmpleado:{type:String},
    idEmpresa:{type:String},
    rol:{type:String},      
    nombreEmpresa:{type:String},
    nit:{type:String},
    socket:{type:String}
});
module.exports = mongoose.model('onlineProveedor', onlineProveedorSquema);
