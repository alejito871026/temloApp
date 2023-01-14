const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const onlineTransportadorSquema = new Schema({
    nombre:{type:String},
    idTransportador:{type:String},
    socket:{type:String}
});
module.exports = mongoose.model('onlineTransportador', onlineTransportadorSquema);
