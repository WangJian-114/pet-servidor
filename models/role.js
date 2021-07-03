const moongose = require('mongoose');

const RoleSchema = moongose.Schema({
    
    rol:{
        type: String,
        require: [true, 'El rol es obligatorio']
    }

});

module.exports = moongose.model('Role', RoleSchema);
