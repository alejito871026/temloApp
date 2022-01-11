const express = require('express');
const router = express.Router();
const OnlineT = require('../models/conectadosT.js')
const OnlineP = require('../models/conectadosP.js')
const OnlineTEM = require('../models/conectadosTemlo.js')
const OnlineCLI = require('../models/conectadosClientes.js')

router.post('/cargarCliente1',async (req, res)=>{
    const r = await OnlineTEM.find().sort({nombreEmpresa:1,rol:1})
    return res.json(r)
})
router.post('/cargarCliente2',async (req, res)=>{
    const r = await OnlineP.find()
    return res.json(r)
})
router.post('/cargarCliente3',async (req, res)=>{
    const r = await OnlineT.find()
    return res.json(r)
})
router.post('/cargarCliente4',async (req, res)=>{
    const r = await OnlineCLI.find()
    return res.json(r)
})
router.post('/validarSesion',async (req, res)=>{
    const r = await OnlineCLI.findOne({id:req.body._id})
    return res.json(r)
})

module.exports = router;