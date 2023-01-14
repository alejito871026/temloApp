const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
    
require('./conexion/database.js');

app.use('/primeraVez', require('./routes/primerVez.js'));
app.use('/newLogin', require('./routes/newLogin.js'));
app.use('/newLoginAdmintemlo', require('./routes/newLoginAdmintemlo.js'));
app.use('/newLoginProveedor', require('./routes/newLoginProveedor.js'));
app.use('/newLoginTransportador', require('./routes/newLoginTransportador.js'));
app.use('/conexion', require('./routes/conexion.js'));
app.use('/empleadosTemlo', require('./routes/empleadosTemlo.js'));
app.use('/proveedores', require('./routes/proveedoresCrud.js'));
app.use('/registroCliente', require('./routes/registroCliente.js'));
app.use('/tYv', require('./routes/transportadoresYvehiculos.js'));

app.use('/productos', require('./routes/productosCrud.js'));
app.use('/imgs', require('./routes/imagenes.js'));
app.use('/imgUploadsProducts',express.static('server/imgUploadsProducts'));

module.exports = app 