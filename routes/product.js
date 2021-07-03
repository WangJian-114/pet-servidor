const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole, } = require('../middlewares');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const { subirArchivo } = require('../middlewares/subirArchivo');


const  productController  = require('../controllers/productController');


const router = Router();

// Obtener todos los productos - Publico
router.get('/', productController.getProducts);



// // Obtener una Producto por nombre - Publico
// router.get('/:name', [ 
//     check('id','No es un ID valido').isMongoId(),
//     check('id').custom(existeProducto)
//     ],
//     validarCampos,
//     productosController.obtenerProducto
// );


// Crear Producto - privado - Admin Role  o Venta Rol
router.post('/', 
    subirArchivo,
    [ 
    check('name', 'The name is required').not().isEmpty(),
    validarJWT,
    esAdminRole,
    validarCampos
    ],
    productController.createProduct
);

// Actualizar Producto - privado - Admin Role  o Venta Rol
router.put('/:id',
    validarJWT, 
    subirArchivo,
    productController.updateProduct    
);


// // Borrar una Producto - privado - Admin
router.delete('/:id',[ 
    validarJWT, 
    esAdminRole,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
    ],
    productController.deleteProduct
);









module.exports = router;