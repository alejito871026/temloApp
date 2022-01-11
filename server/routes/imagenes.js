const express = require('express');
const router = express.Router();
const mult = require('../middlewares/midImgs.js');

router.post('/guardarFotoProducto', mult, async (req, res) => {
    res.json({
        success:true,
        resp:req.file
    })
})


module.exports = router;
