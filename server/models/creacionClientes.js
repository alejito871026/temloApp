
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt')

const creacionClienteSquema = new Schema({
    emailC:{type:String,unique:true},
    emailPass:{type:String},
    emailOportunidades:{type:Number, default:0},
    cedulaValidate:{type:Boolean,dafault:false},
    cedulaInfo:{type:String},
    cedulaNombre:{type:String},
    cedulaC:{type:Number},
    cedulaFechaNac:{type:Date},
    phoneC:{type:Number},
    phonePass:{type:String},
    smsOportunidades:{type:Number, default:0},
    fechaCreacion:{type: Date, default: new Date()},
    socketId:{type:String},
});

creacionClienteSquema.methods.encryptPassword = (contrasenaC) => {
    return bcrypt.hashSync(contrasenaC, bcrypt.genSaltSync(10));
};

creacionClienteSquema.methods.compararContrasena = function (contrasenaC){
    return bcrypt.compareSync(contrasenaC, this.emailPass)
};
creacionClienteSquema.methods.compararContrasenaSms = function (contrasenaSms){
    return bcrypt.compareSync(contrasenaSms, this.phonePass)
};
module.exports = mongoose.model('creacionCliente', creacionClienteSquema);