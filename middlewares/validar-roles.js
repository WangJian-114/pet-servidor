const { request, response } = require("express");

const esAdminRole = (req=request, res=response, next ) => {

    if(!req.usuarioAutenticado){
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validae el token primero'
        });
    }

    const { rol, name } = req.usuarioAutenticado;
    
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} no es administrador - acceso denegado `
        })
    }



    next();
}


// Todos los que usuario manda va quedar guardado en el roles
const tieneRole = ( ...roles ) => {
    return ( req, res = response, next ) => {

        if(!req.usuarioAutenticado){
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validae el token primero'
            });
        }

        const { rol, name } = req.usuarioAutenticado;
        
        if( !roles.includes(rol)){
            return res.status(401).json({
                msg: `${name} no tiene rol, el servicio requiere uno de estos roles ${ roles }`
            })
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}