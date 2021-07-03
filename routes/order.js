const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, } = require('../middlewares');

const { existeProducto } = require('../helpers/db-validators');
const { inicializeCart } = require('../middlewares/inicializarCarrito');

const  orderController  = require('../controllers/orderController');

const router = Router();

// Obtener todos los pedidos
router.get('/', 
    validarJWT,
    orderController.getAllOrder
);

// Obtener un pedido con su ID
router.get('/:idPedido',[ 
    validarJWT, 
    check('idPedido','No es un ID valido').isMongoId(),
    validarCampos
    ],
    orderController.getOrder
);

router.get('/ordenesreciente/orden',
    validarJWT, 
    orderController.getRecentOrder
);

router.get('/ordenespendientes/orden',
    validarJWT, 
    orderController.pendingOrders
);

// Obtener los mejores clientes
router.get('/mejoresclientes/clientes', 
    validarJWT,
    orderController.mejoresClientes
);

router.get('/productosMasVendido/productos', 
    validarJWT,
    orderController.productosMasVendido
);

// Generar un pedido
router.post('/',
    validarJWT,
    inicializeCart,
    orderController.addOrder
);

// Modificar el estado de un pedido
router.put('/:idPedido',
    validarJWT,
    orderController.changeStateOrder
);

// Borrar un pedido por su ID
router.delete('/:idPedido',[ 
    validarJWT, 
    check('idPedido','No es un ID valido').isMongoId(),
    validarCampos
    ],
    orderController.deleteOrder
);









module.exports = router;