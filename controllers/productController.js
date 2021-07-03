const Product = require('../models/product');
const path = require('path');
const fs = require('fs');


exports.getProducts = async (req, res) => {
    try {

        const products = await Promise.all([
            Product.countDocuments({}),
            Product.find({ available : true})
        ]);

       
        // DESTRUCTURACION DE ARREGLO
        const [ total, productos ] = products;

        res.json({
            total,
            msg : "Consulta se ejecuto correctamente",
            productos
        })



    } catch (error) {
        console.log(error);
        res.json({ msg: 'Hubo un error' })
    }
}


exports.createProduct = async (req, res) => {

    try {

        const producto = new Product(req.body);
        producto.creator = req.uid;

        // si el producto viene con imagen

        if(req.file) {
            producto.img = req.file.filename;
        } else {
            producto.img = "no-imagen.png";
        }

        await producto.save();
        res.json({msg:'Se agrego un nuevo producto'})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }
}


exports.updateProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const info = req.body;

        info.creator = req.uid;

        const product = await Product.findOne({ _id: id });

        if(req.file){
            // Hay que borrar la imagen del servidor 
            const pathImagen = path.join(__dirname, '../uploads', product.img);
            // Si existe el archivo
            // if(fs.existsSync( pathImagen )){
                console.log(pathImagen);
                if(product.img !== 'no-imagen.png'){
                    fs.unlinkSync( pathImagen );
                }
            // }
            info.img = req.file.filename;
        } else {
            info.img = product.img;
        }

        const newProduct = await Product.findByIdAndUpdate( id, info );  

        res.status(200).json({
            msg:'Producto modificado exitosamente',
            newProduct
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }
}

exports.deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const ProductDeleted = await Product.findByIdAndUpdate( id, { available : false } );  

        res.status(200).json({
            msg:'Producto agregado exitosamente',
            ProductDeleted
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }
}



// exports.buscarProducto = async (req, res, next) => {
//     try {
//         // obtener el query
//         const { query } = req.params;
//         const producto = await Productos.find({ nombre: new RegExp(query, 'i') });
//         res.json(producto);
//     } catch (error) {
//         console.log(error);
//         next();
//     }
// }