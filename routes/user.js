const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


const { esRoleValido, emailExiste, existeUsuario }= require('../helpers/db-validators');

const userController = require('../controllers/userController');

const router = Router();

router.get('/', userController.getAllUsers);

router.post('/', [
        check('name', 'The name is required').not().isEmpty(),
        check('password','The password is required and more than 6 letters').not().isEmpty().isLength({ min:6}),
        check('email').custom((email)=>emailExiste(email)),
        check('rol').custom( (rol) => esRoleValido(rol)),
        validarCampos 
    ], userController.createUser);

// put para usuario
router.put('/:id',[

    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuario),
    validarCampos 

    ], userController.updateUser);

// Put para el admin
router.put('/rol/:id',[
    validarJWT, 
    esAdminRole,
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuario),
    check('rol').custom( (rol) => esRoleValido(rol)),
    validarCampos 

    ], userController.asignarRol);
    


router.delete('/:id',
    validarJWT, 
    esAdminRole,
    [
        check('id','No es un ID valido').isMongoId(),
        check('id').custom(existeUsuario),
        validarCampos
    ], userController.deleteUser);






module.exports = router;