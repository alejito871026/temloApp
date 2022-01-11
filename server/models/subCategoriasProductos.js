const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategoriaSquema = new Schema({
    nombreSubCategoria:{type:String},
    idCategoria:{type:String}
});
module.exports = mongoose.model('subCategoria', subCategoriaSquema);