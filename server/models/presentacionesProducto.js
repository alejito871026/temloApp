const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PresentacionSquema = new Schema({
    nombrePresentacion:{type:String, required:[true,'Nombre presentacion obligatorio']},
    udps:{type:Array},
    marca:{type:Array},
    rutaImagen:{type:String},
});
module.exports = mongoose.model('Presentacion', PresentacionSquema);