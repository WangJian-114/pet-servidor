
const Rol = require('../models/role');
const User = require('../models/user');
const Product = require('../models/product');

const esRoleValido = async (rol ='') => {
    const existeRol = await Rol.findOne({ rol });
    if(!existeRol) {
        throw new Error(`El rol ${ rol } no esta registrado en la BD`);
    }
}


const emailExiste = async (email = '') => {
    // Verificar si el correo existe
    const exist = await User.findOne({ email, state: true });
    if(exist){
        throw new Error(`El correo: ${ email }  ya esta registrado`);
    }
}


const existeUsuario = async ( id ) => {
    // Verificar si el usuario existe
    const exist = await User.findById(id);
    if(!exist){
        throw new Error(`El usuario con ID: ${ id }  No existe`);
    }
}

// const existeCategoria = async (id) => {
//     // Verificar si categoria si existe
//     const existeCategoria = await Categoria.findById(id);
//     if(!existeCategoria){
//         throw new Error(`La categoria con ID: ${ id }  No existe`);
//     }
// }

const existeProducto = async (id) => {

    const ProductoDB = await Product.findById(id);
    if(!ProductoDB){
        throw new Error( `El Producto, No existe`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuario,
    existeProducto
}

