const mongoose = require('mongoose');

const CartSchema =mongoose.Schema({

    carrito: [{
        productId: String,
        name: String,
        price: Number,
        description: String,
        img: String,
        cant:Number
    }],

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    total: {
        type:Number,
        default: 0,
    }

});

CartSchema.methods.toJSON = function() {
    // Sacando la v y password , dejando todo los de mas
    const { __v, ...cart } = this.toObject();
    return cart;
}

module.exports = mongoose.model('Cart', CartSchema );