const moongose = require('mongoose');

const ProductSchema = moongose.Schema({
    
    name:{
        type: String,
        require: [true, 'El nombre es obligatorio'],
    },

    creator: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    price: {
        type:Number,
        default: 0,
    },

    description: {
        type: String
    },

    stock: {
        type: Number,
        default:0,
    },

    available: {
        type: Boolean,
        default: true,
        require: true
    },

    img: {
        type: String
    }


});

ProductSchema.methods.toJSON = function() {
    // Sacando la v y password , dejando todo los de mas
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = moongose.model('Product', ProductSchema );
