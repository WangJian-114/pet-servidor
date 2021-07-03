const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    
    order: [{
        productId: String,
        name: String,
        price: Number,
        description: String,
        img: String,
        cant:Number
    }],

    state: {
        type: String,
        default: 'PENDIENTE'
    },

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    total: {
        type: Number
    },

    creado:{
        type: Date,
        default: Date.now()
    }

});


module.exports = mongoose.model('Order', OrderSchema );
