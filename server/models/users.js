const mongoose = require('mongoose');
const bcrypt = require ('bcrypt')
const Schema = mongoose.Schema;

const UsersSquema = new Schema({
    nombre: { type: String, required:[true,'Nombre obligatorio']},
    primerApellido:{ type:String, required:[true,'Primer apellido obligatorio']},
    segundoApellido:{ type:String},
    cedula: {unique:true, type: Number},
    contrasena: { type: String, required:[true,'Contraseña obligatorio']},
    celular:{unique:true, type : Array, required:[true,'Celular obligatorio']},
    direccion: { type : String},
    email:{unique:true,type:String},
    rol:{ type:String, required:[true,'rol obligatorio']},
    fechaAgregado:{type:Date, required:[true,'Fecha Agregado obligatorio']},
    fechaNac:{ type:Date, required:[true,'Fecha Nacimiento obligatorio']},
    editado:{type:Boolean, default:true},
    activo:{type:Boolean, default:true},
    empresa:[{ type:Schema.Types.ObjectId, ref:"empresa"}]
});

UsersSquema.methods.encryptPassword = (contrasena) => {
    return bcrypt.hashSync(contrasena, bcrypt.genSaltSync(10));
};

UsersSquema.methods.compararContrasena = function (contrasena){
    return bcrypt.compareSync(contrasena, this.contrasena)
};

module.exports = mongoose.model('users', UsersSquema);