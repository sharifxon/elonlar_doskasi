const multer = require('multer');
const path = require('path');


// set Storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename:function(req, file, cb){
        cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
    }
})

// initalize upload
const upload = multer({
    storage,
    limits: {fileSize:1024*1024*10},
    fileFilter: function(req, file, cb){
        checkfiletype(file, cb)
    }
})

function checkfiletype(file, cb){
    const filetype = /jpg|png|jpeg|web|gif/
    const extname = filetype.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetype.test(file.mimetype)

    if(extname && mimetype) {
        return cb(null, true)
    }
    else{
        return `Error siz faqat rasm formatidagi file yuklashingiz mumkin`
    }
}

module.exports = upload
