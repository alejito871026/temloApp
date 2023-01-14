const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehiculoSquema = new Schema({
    tipoVehiculo: { type:Schema.Types.ObjectId, ref:"tipoVehiculo", required:[true,"Falta el tipo de vehiculo"]},
    placa:{ type : String, unique, required:[true,"falta la placa"]},
    modelo:{ type : Number, required:[true,"falta el modelo"]},
    matriculadoEn:{ type : String, required:[true,"falta matriculado en"]},
    seguroHasta:{type : Date, required:[true,"falta la fecha final del seguro"]},
    tecnoHasta:{type : Date, required:[true,"falta la fecha final de la tecnomecanica"]},

});

module.exports = mongoose.model('Vehiculo', VehiculoSquema);