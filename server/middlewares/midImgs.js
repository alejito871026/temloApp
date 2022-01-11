const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const storage = multer.diskStorage({
    destination:'./server/imgUploadsProducts',
    filename:(req,res,callback)=>{
        callback(null,uuidv4()+path.extname(res.originalname))
    }
})
const mult = multer({
    storage,
}).single('imagenUpload')
module.exports = mult