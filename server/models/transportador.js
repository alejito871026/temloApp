const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const TransportadorSquema = new Schema({
    nombreT: { type: String, required:[true,'Nombre obligatorio']},
    primerApellidoT:{ type:String, required:[true,'Primer apellido obligatorio']},
    segundoApellidoT:{ type:String, required:[true,'Segundo Apellido obligatorio']},
    cedulaT: {unique:true, type: Number, required:[true,'Cedula obligatorio']},
    contrasenaT: { type: String, required:[true,'Contraseña obligatorio']},
    celularT:{unique:true, type : Number,required:[true,'Celular obligatorio']},
    direccionT: { type : String, required:[true,'Direccion obligatorio']},
    emailT:{unique:true,type:String, required:[true,'Direccion obligatorio']},
    fechaAgregadoT:{type:Date, required:[true,'Fecha Agregado obligatorio']},
    fechaNacT:{ type:Date, required:[true,'Fecha Nacimiento obligatorio']},
    editadoT:{type:Boolean, default:false},
    runt:{type:object},//informacion sobre el transportador en cuanto a documentacion para condicr
    estadoActivoTransportado:{type:Boolean, default:false}
});

TransportadorSquema.methods.encryptPassword = (contrasenaT) => {
    return bcrypt.hashSync(contrasenaT, bcrypt.genSaltSync(10));
};

TransportadorSquema.methods.compararContrasena = function (contrasenaT){
    return bcrypt.compareSync(contrasenaT, this.contrasenaT)
};

module.exports = mongoose.model('Transportador', TransportadorSquema);