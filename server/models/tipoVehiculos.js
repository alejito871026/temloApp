const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoVehiculoSquema = new Schema({
    nombreTipo: { type:String, unique:true, required:[true,"Falta el tipo de vehiculo"]},
    capacidadPesoMin:{ type : Number, required:[true,"Falta la placa"]},
    ejes:{ type : Number, required:[true,"Falta la cantidad de ejes"]},
    capacidadPesoMAx:{ type : Number, required:[true,"Falta la placa"]},
    largo:{ type : Number, required:[true,"Falta el modelo"]},
    ancho:{ type : Number, required:[true,"Falta matriculado en"]},
    alto:{type : Number, required:[true,"Falta la fecha final del seguro"]},
    proteccionAgua:{type:Boolean, default:false},
});

module.exports = mongoose.model('TipoVehiculo', TipoVehiculoSquema);