const multer = require('multer');
const shortid = require('shortid');


const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),

    fileFilter(req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, true);
        }else {
            cb (new Error('Formato no valido'))
        }
    }
}

// Pasar la configuracion y el campo
const upload = multer(configuracionMulter).single('img');

// Sube un archivo
exports.subirArchivo = async (req, res, next) => {

    upload(req, res, function(error){
        // console.log('subiendo');
        if(error){
            res.json({ mensaje : error})
        }
        return next();
    })
}
