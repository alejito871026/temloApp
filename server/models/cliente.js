const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const ClienteSquema = new Schema({
    nombreCompletoC: { type: String, required:[true,'Nombre obligatorio']},
    cedulaC: {unique:true, type: Number, required:[true,'Cedula obligatorio']},
    contrasenaC: { type: String, required:[true,'Contraseña obligatorio']},
    celularC:{unique:true, type : Number,required:[true,'Celular obligatorio']},
    //direccionC: { type : String, required:[true,'Direccion obligatorio']},
    emailC:{unique:true,type:String, required:[true,'Direccion obligatorio']},
    fechaAgregado:{ type:Date, required:[true,'Fecha Agregado obligatorio']},
    fechaNacC:{ type:Date, required:[true,'Fecha Nacimiento obligatorio']},
    editado:{type:Boolean, default:false},
    conCelular:{type:Boolean, default:false}, 
    conMail:{type:Boolean, default:false}
});

ClienteSquema.methods.encryptPassword = (contrasenaC) => {
    return bcrypt.hashSync(contrasenaC, bcrypt.genSaltSync(10));
};

ClienteSquema.methods.compararContrasena = function (contrasenaC){
    return bcrypt.compareSync(contrasenaC, this.contrasenaC)
};

module.exports = mongoose.model('Cliente', ClienteSquema);