const Order = require('../models/order');


exports.getAllOrder = async (req, res) => {

    try {
        const orders = await Order.find({}).populate('client').populate('order'); 
        res.status(200).json({
            msg: 'Todos los pedidos',
            orders
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        });
    }
}

exports.pendingOrders = async (req, res) => {

    try {
    
        const pendingOrders = await Order.countDocuments({ state : 'PENDIENTE' }); 
        res.status(200).json({
            pendingOrders 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        });
    }
}


exports.getRecentOrder = async (req, res, next) => {

    try {
        const recentOrders = await Order.find({}).populate('client').limit(5).sort({ creado: 'desc'});
        res.status(200).json({
            msg: 'Todos los pedidos',
            recentOrders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }  
}
    

exports.getOrder = async (req, res, next) => {

    try {

        const order = await Order.find({  client : req.uid}).populate('client').populate('order'); 
        if(!order){
            res.json({mensaje: 'Ese pedido no existe'});
            return next();
    
        }    
        res.status(200).json(order);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        })
    }

}


exports.addOrder = async (req, res) => {

    const { carrito, total } = req.body;
    const info = {
        order: carrito,
        client: req.uid,
        total
    };
    
    const order = new Order(info).populate('client').populate('order'); 

    try {
        await order.save();
        res.status(200).json({
            msg:'El pedido se genero correctamente',
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        });
    }
}

exports.changeStateOrder = async (req, res) => {
    const { idPedido } = req.params;
    // console.log(idPedido);
    try {

        let pedido = await Order.findByIdAndUpdate( idPedido,  req.body, {new: true} ).populate('client').populate('order');

        res.json({
            msg:'Se actualizo correctamente',
            pedido
        })
        
    } catch (error) {
        console.log(error);
    }


};


exports.deleteOrder = async (req, res, next) => {

    try{
        await Order.findOneAndDelete({ _id : req.params.idPedido });
        res.status(200).json({
            msg:'El Pedido se ha eliminado'
        })
    }catch (error) {
        console.log(error);
        next();
    }

};


exports.mejoresClientes = async (req, res) => {

    try {
        /**  
         * Filtrar los pedidos con el estado completado
         * Sumo el total de cada pedidos y lo agrupo por cliente
         * lookup es como hacer join en SQL 
         * from: nombre de modelo para hacer join
         * as: crear una alias
        **/
        const mejoresClientes = await Order.aggregate([
            { $match : { state : "COMPLETADO" } },
            { $group : {
                _id : "$client", 
                total: { $sum: '$total' }
            }}, 
            {
                $lookup: {
                    from: 'users', 
                    localField: '_id',
                    foreignField: "_id",
                    as: "clientes"
                }
            }, 
            {
                $limit: 7
            }, 
            {
                $sort : { total : -1 }
            }
        ]);

        res.status(200).json({
            mejoresClientes
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error'
        });
    }
    
}

exports.productosMasVendido = async (req, res) => {

    try {
        const pedidos = await Order.find({ state: "COMPLETADO"});
        let productosMasVendido = [];
        let productosMasVendidoFinal = [];
    
        let cont = 0;
        pedidos.map((pedido) => {
            pedido.order.map((producto) => {
                productosMasVendido[cont] = {
                    name:producto.name,
                    vendido: producto.cant
                }
                cont++
            })
        });

        // console.log(productosMasVendido);
        productosMasVendido.map((producto) => {
           const exist  = productosMasVendidoFinal.some(product => product.name === producto.name);
           if(exist){
              productosMasVendidoFinal.map(p => {
                  if(p.name === producto.name){
                      p.vendido += producto.vendido
                  }
              })
           } else{
                productosMasVendidoFinal = [...productosMasVendidoFinal, producto]
           }
        });
        // console.log(productosMasVendidoFinal);

        // Funcion para ordenar la lista de mayor a menos segun la vendido
        const productosMasVendidoOrdenado = productosMasVendidoFinal.sort(function (a, b){
            return (b.vendido - a.vendido)
        })
        // console.log(productosMasVendidoOrdenado);

        res.status(200).json({
            productosMasVendidoOrdenado
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hubo un error',
            error
        });
    }
}

