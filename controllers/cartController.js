const Cart = require('../models/cart');
const Product = require('../models/product');

const { calcTotal } = require('../helpers/calcTotal');


exports.getCart = async (req, res) => {

    try {
        const id  = req.uid;
    
        const cartUser = await Cart.findOne({ user:id }).populate('user', '-password -address -__v -email');

        res.json({
            msg:'getCart funciona',
            cartUser
        });
        
    } catch (error) {
        console.log(error);
    }

}


exports.addCart = async (req, res) => {

    try {
        // Extraemos el ID de producto
        const { idProduct } = req.params;

        // console.log(req.body);

        // Buscamos el producto en la base de datos
        const product = await Product.findOne({ _id:idProduct });
        const { price, name, description, img } = product;
        

        // Buscamos el carrito del usuario que esta realizando la operacion 
        const cartUser = await Cart.findOne({ user:req.uid });
        
        // Extramoe el Id del carrito que pertenece el usuario
        const { id } = cartUser;

        // Preparamos el objeto producto 
        const productToAdd = {
            productId:idProduct,
            name,
            price,  
            description,
            img,
            cant:req.body.cant
        };

        // if(articulo.cantidad > producto.existencia) {
        //     throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
        // } else {
        //     // Restar la cantidad a lo disponible
        //     producto.existencia = producto.existencia - articulo.cantidad;

        //     await producto.save();
        // }

        if(req.body.cant > product.stock ){
            console.log('es mayor');
            return res.status(400).json({ msg:`El producto: ${product.name} excede la cantidad disponible` });
        } else {
            product.stock -= req.body.cant;
            // TODO:Chequear que no sea negativo
            await product.save();
        }
    
        // Verificamos si el producto ya existe o no en el carrito
        const oldCart = cartUser.carrito;
        const exist = oldCart.some(producto => producto.productId  === productToAdd.productId );

        if(exist){
            for(let i of oldCart){
                if( i.productId  === productToAdd.productId ){
                    i.cant += req.body.cant
                }
            }
            const total = calcTotal(oldCart);
    
            const newInfo = {
                total,
                carrito:oldCart          
            };

            let FinalCart = await Cart.findByIdAndUpdate( id,  newInfo, {new: true} );  
            res.json({
                msg:'Se modifico correctamente',
                FinalCart
            });

        } else {

            // Preparamos el objeto para agregarlo en el carrito
            const newCart = {
                carrito:[
                    ...cartUser.carrito,
                    productToAdd
                ]           
            };

            const cart = newCart.carrito;

            const total = calcTotal(cart);

            const newInfo ={
                total,
                carrito:[
                    ...cartUser.carrito,
                    productToAdd
                ]  
            }

            let FinalCart = await Cart.findByIdAndUpdate( id,  newInfo, {new: true} ); 
             
            res.json({
                msg:'El producto se agrego correctamente',
                FinalCart
            });
        }  

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'});
    }

}


exports.deleteCart = async (req, res) => {

    try {
            
        const {carrito, id} = await Cart.findOne({ user:req.uid });

        const finalCart = carrito.filter( producto => producto.productId  !== req.params.id )
 
        const total = calcTotal(finalCart);
        const newInfo = {
            total,
            carrito:finalCart
        }
    
        const result = await Cart.findByIdAndUpdate( id,  newInfo, {new: true}  ) 

        res.status(200).json({
            msg:"Eliminando producto del carrito",
            result
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }

}
