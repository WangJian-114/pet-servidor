const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    name: {
        type: String,
        require: [true, 'the name is required'],
        trim:true
    },

    last_name: {
        type: String,
        trim:true
    },

    email: {
        type: String,
        require: [true, 'the email is required'],
        trim:true,
        unique: true
    },

    password: {
        type: String,
        require: [true, 'the password is required'],
        trim:true
    },

    address: {
        type: String,
        require: [true, 'the address is required'],
    },

    tel: {
        type:String,
        trim:true
    },

    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },

    state: {
        type: Boolean,
        default: true
    }

});

// Tiene que ser una funcion normal
UserSchema.methods.toJSON = function() {
    // Sacando la v y password , dejando todo los de mas
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}


module.exports = mongoose.model('User', UserSchema);