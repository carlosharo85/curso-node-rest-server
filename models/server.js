require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');


class Server {

    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;

        // paths
        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuario',
            categoria: '/api/categoria',
            producto: '/api/producto',
            buscar: '/api/buscar',
            upload: '/api/upload'
        }

        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();
        
        // Rutas de Applicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // cors
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use(express.json());

        // directorio publico
        this.app.use(express.static(__dirname+'/../public'));

        // fileUpload - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuario, require('../routes/usuario'));
        this.app.use(this.paths.categoria, require('../routes/categoria'));
        this.app.use(this.paths.producto, require('../routes/producto'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.upload, require('../routes/upload'));
    }

    listen() {
        this.app.listen(this.PORT, () => {
            console.log(`Escuchando en el puerto: ${this.PORT}`);
        });
    }
}


module.exports = Server;