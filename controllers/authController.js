const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const logIn = async (req, res) =>{

    const { email, password } = req.body;

    try {
        
        // Verificar si el email existe
        const usuario = await User.findOne({ email });

        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - email'
            });
        }
        
        // Si el usuario  no esta activo
        if(!usuario.state){
            return res.status(400).json({
                msg:'Usuario inactivo - state : false'
            });
        }


        // Verificar el password
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if(!validarPassword){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            msg: 'login ok',
            token
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg:'Hubo un error'
        })
    }

}

const authenticatedUser = async (req, res) => {

    // Obtiene que usuario esta autenticado
    try {
        const usuario = await User.findById(req.uid).select('-password');
        res.status(200).json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}



// cambiar el password por uno nuevo

const changePassword = async (req, res)=> {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // verificamos si el usuario existe
    if(!user){
        res.status(404).json({
            msg: "El email no existe en la base de datos",
        });
    }

    // hashear el nuevo password
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10) );


    // guardamos 
    await user.save();

    res.json({
        msg: "El password se modifico correctamente",
        user
    });
    
}


module.exports = {
    logIn,
    authenticatedUser,
    changePassword
}
