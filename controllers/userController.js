const User = require('../models/user');
const Cart = require('../models/cart');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


exports.getAllUsers = async (req, res) => {
    
    try {

        const reps = await Promise.all([
            User.countDocuments({ state: true }),
            User.find({ state: true })
        ]);
       
        // DESTRUCTURACION DE ARREGLO
        const [ total, users ] = reps;

        res.json({
            total,
            msg : "Consulta se ejecuto correctamente",
            users
        })
    
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Hubo un error",
            error
        })
    }


}

exports.createUser = async (req, res) => {

    try {

        // Extraer los campos de req.body
        const { name, email, password, rol, address } = req.body;


        // Creo un nuevo User
        const newUser = new User({ name, email, password, rol, address });

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        newUser.password = bcrypt.hashSync( password, salt );

        // Guardar en BD
        await newUser.save();

        // Inicializamos el carrito del nuevo usuario
        const cartUser = new Cart({
            user:newUser._id
        });

        await cartUser.save();

        // Generar JWT
        const token = await generarJWT( newUser.id, newUser.name );


        res.status(200).json({
            msg : "Usuario creado correctamente",
            newUser,
            cartUser,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            msg: "Hubo un error",
            error
        })
    }
}

exports.updateUser = async (req, res) => {

    try {
        const { id } = req.params;
        
        const { email, rol, password, ...resto } = req.body;

        const usuario = await User.findByIdAndUpdate( id, resto, {new:true} );  

        res.status(200).json({
            estado:'Usuario actualizado con exito',
            usuario
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }

}


exports.deleteUser = async (req, res) => {
    
    try {
        // id del usuario que se va a eliminar
        const { id } = req.params;

        // La forma recomendada
        const usuario = await User.findByIdAndUpdate(id, { state: false });

        res.json({
            msg:`Usuario con el ID: ${id} fue eliminado`,    
            usuario
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }
}


exports.asignarRol = async (req, res) => {
    try {
        console.log(req.body);
        // id del usuario que se va a eliminar
        const { id } = req.params;
        const { rol } = req.body;

    

        // La forma recomendada
        const usuario = await User.findByIdAndUpdate(id, { rol},  { new: true });

        res.json({
            msg:`Usuario con el ID: ${id} se modifico correctamente`,    
            usuario
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }
}

