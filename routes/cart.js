const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, } = require('../middlewares');

const { existeProducto } = require('../helpers/db-validators');


const  cartController  = require('../controllers/cartController');


const router = Router();

// Obtener carrito del usuario autenticado
router.get('/', 
    validarJWT,
    cartController.getCart
);

router.post('/:idProduct',[
    validarJWT,
    check('idProduct','No es un ID valido').isMongoId(),
    validarCampos
    ],
    cartController.addCart
)


// // Borrar un producto del carrito
router.delete('/:id',[ 
    validarJWT, 
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
    ],
    cartController.deleteCart
);









module.exports = router;