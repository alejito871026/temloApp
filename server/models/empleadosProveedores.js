const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const EmpleadoEPSquema = new Schema({
    nombreEP: { type: String, required:[true,'Nombre obligatorio']},
    primerApellidoEP:{ type:String, required:[true,'Primer apellido obligatorio']},
    segundoApellidoEP:{ type:String, required:[true,'Segundo Apellido obligatorio']},
    cedulaEP: {unique:true, type: Number, required:[true,'Cedula obligatorio']},
    contrasenaEP: { type: String, required:[true,'Contraseña obligatorio']},
    celularEP:{unique:true, type : Number,required:[true,'Celular obligatorio']},
    direccionEP: { type : String, required:[true,'Direccion obligatorio']},
    emailEP:{unique:true,type:String, required:[true,'Direccion obligatorio']},
    rol:{ type:String, required:[true,'rol obligatorio']},
    fechaAgregadoEP:{type:Date, required:[true,'Fecha Agregado obligatorio']},
    fechaNacEP:{ type:Date, required:[true,'Fecha Nacimiento obligatorio']},
    editado:{type:Boolean, default:true},
    conCelular:{type:Boolean, default:false},
    conMail:{type:Boolean, default:false},
    empresaProveedoraEP:{type:Schema.Types.ObjectId, ref:"Proveedor"},
    activo:{type:Boolean, default:true}
});

EmpleadoEPSquema.methods.encryptPassword = (contrasenaEP) => {
    return bcrypt.hashSync(contrasenaEP, bcrypt.genSaltSync(10));
};

EmpleadoEPSquema.methods.compararContrasena = function (contrasenaEP){
    return bcrypt.compareSync(contrasenaEP, this.contrasenaEP)
};

module.exports = mongoose.model('EmpleadoEP', EmpleadoEPSquema);