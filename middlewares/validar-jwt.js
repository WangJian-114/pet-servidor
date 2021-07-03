const { response, request } = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

   

    try {

        const payload = jwt.verify(token, process.env.SECRETOPRIVATEKEY);

        const { uid } = payload;

        // Leer el usuario que corresponde al uid
        const usuarioAutenticado = await User.findById(uid);
        
        if(!usuarioAutenticado){
            return res.status(401).json({
                msg:'Token no valido, -uid no existe'
            })
        }

        if(!usuarioAutenticado.state){
            return res.status(401).json({
                msg:'Token no valido, -state'
            })
        }

        req.usuarioAutenticado = usuarioAutenticado;

        req.uid = uid;


        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

}

module.exports = {

    validarJWT

}