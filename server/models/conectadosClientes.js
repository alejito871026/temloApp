const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const onlineClienteSquema = new Schema({
    nombre:{type:String},
    rol:{type:String},
    id:{type:String},
    socket:{type:String}
});
module.exports = mongoose.model('onlineCliente', onlineClienteSquema);
