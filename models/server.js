require('dotenv').config();
const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;

        // paths
        this.userPath = '/api/user';

        // Middlewares
        this.middlewares();
        
        // Rutas de Applicacion
        this.routes();
    }

    middlewares() {
        // cors
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use(express.json());

        // directorio publico
        this.app.use(express.static(__dirname+'/../public'));
    }

    routes() {
        this.app.use(this.userPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Escuchando en el puerto: ${this.PORT}`);
        });
    }

}

module.exports = Server;