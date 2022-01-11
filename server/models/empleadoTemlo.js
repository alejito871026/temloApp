const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const EmpleadoTemloSquema = new Schema({
    nombreE: { type: String, required:[true,'Nombre obligatorio']},
    primerApellidoE:{ type:String, required:[true,'Primer apellido obligatorio']},
    segundoApellidoE:{ type:String, required:[true,'Segundo Apellido obligatorio']},
    cedulaE: {unique:true, type: Number, required:[true,'Cedula obligatorio']},
    contrasenaE: { type: String, required:[true,'Contraseña obligatorio']}, 
    celularE:{unique:true, type : Number, required:[true,'Celular obligatorio']},
    direccionE: { type : String, required:[true,'Direccion obligatorio']},
    emailE:{unique:true,type:String, required:[true,'Direccion obligatorio']},
    rol:{ type:String, required:[true,'rol obligatorio']},
    fechaAgregado:{type:Date, required:[true,'Fecha Agregado obligatorio']},
    fechaNacE:{ type:Date, required:[true,'Fecha Nacimiento obligatorio']},
    editado:{type:Boolean, default:true},
    activo:{type:Boolean, default:true},
    conCelular:{type:Boolean, default:false},
    conMail:{type:Boolean, default:false},
    empresa:{type:Schema.Types.ObjectId, ref:"temlo", required:[true,"debes agregar el id de la empresa"]}
});

EmpleadoTemloSquema.methods.encryptPassword = (contrasenaE) => {
    return bcrypt.hashSync(contrasenaE, bcrypt.genSaltSync(10));
};

EmpleadoTemloSquema.methods.compararContrasena = function (contrasenaE){
    return bcrypt.compareSync(contrasenaE, this.contrasenaE)
};

module.exports = mongoose.model('EmpleadoTemlo', EmpleadoTemloSquema);