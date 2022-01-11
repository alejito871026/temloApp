const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const temlosSquema = new Schema({
    nit: {unique:true, type:String, required:[true,"debes agregar el nit "]},
    nombre:{ type:String, required:[true,"debes agregar el nombre de la empresa"]},
    direccion:{ type:String,unique:true, required:[true,"la direccion es obligatoria"]},
    telefonos:{type:Array, required:[true,"el telefono es obliatorio"]},
    superAdmin: [{ type:Schema.Types.ObjectId, ref:"EmpleadoTemlo", required:[true,"debes agregar el id del SUPERADMIN primero"]}]
});

module.exports = mongoose.model('temlo', temlosSquema);