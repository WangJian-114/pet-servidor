const Cart = require('../models/cart');

const inicializeCart = async (req, res, next) => {
    console.log('Limpiando carrito');

    try {

        const id = req.uid;
        console.log(id);
        // const cartUser = await Cart.findOne({ user:id });
        await Cart.findOneAndUpdate( { user: id},  { carrito:[]} );  
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'})
    }

    next();
}


module.exports = {
    inicializeCart
}