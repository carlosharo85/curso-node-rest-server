const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg'], carpeta = '' ) => {
    return new Promise( (resolve, reject) => {
        const { archivo } = files;
        const nombrePartes = archivo.name.split('.');
        const extension = nombrePartes[nombrePartes.length - 1];

        // validar extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida: ${extensionesValidas}`);
        }

        const newNombre = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, newNombre );

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(newNombre);
        });
    });
}


module.exports = {
    subirArchivo
}