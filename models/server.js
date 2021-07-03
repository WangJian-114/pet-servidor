const express = require('express');
const { dbConnection } = require('../DB/config');
const app = express();
var cors = require('cors');




class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            cart:       '/api/cart',
            product:    '/api/product',
            order:      '/api/order',
            user:       '/api/user',
        }

       

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion

        this.routes();
    }

    async conectarDB() {
        await dbConnection(); 
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // lectura y Parseo del body
        this.app.use(express.json());

        // carpeta publica
        // Muy importante para que en tu front end muestra el imagen
        this.app.use(express.static('uploads'));


    }

    routes() {
        this.app.use(this.paths.auth,       require('../routes/auth'));
        this.app.use(this.paths.cart,       require('../routes/cart'));
        this.app.use(this.paths.product,    require('../routes/product'));
        this.app.use(this.paths.order,      require('../routes/order'));
        this.app.use(this.paths.user,       require('../routes/user'));
    
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log('Escuchando en el puerto ', this.port);
        });
    }

}

module.exports = Server;