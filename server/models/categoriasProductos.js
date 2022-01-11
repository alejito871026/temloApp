const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriaSquema = new Schema({
    nombreCategoria:{type:String},
});
module.exports = mongoose.model('Categoria', CategoriaSquema);