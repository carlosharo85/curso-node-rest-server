const { request, response } = require("express");
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const { subirArchivo } = require('../helpers/index');
const { Usuario, Producto } = require('../models/index');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


const uploadFile = async( req = request, res = response ) => {
    try {
        //const archivo = await subirArchivo(req.files, undefined, 'usuarios');
        const archivo = await subirArchivo(req.files, ['txt', 'pdf'], 'usuarios');

        return res.json({
            nombre: archivo
        });
    } catch(err) {
        return res.status(400).json({
            msg: err
        });
    }
}

const actualizarImagen = async( req = request, res = response ) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: `La colección: ${coleccion} no es permitida!`
            });
    }

    
    //limpiar imagenes previas
    if (modelo.img) {
        //hay que borrar la imagen del servidor
        const uploadPath = path.join( __dirname, '../uploads/', coleccion, modelo.img );

        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }
    }


    try {
        const imagen = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = imagen;

        await modelo.save();

        
        return res.json({
            msg: 'Se guardo imagen correctamente',
            data: modelo
        });
    } catch(err) {
        return res.status(400).json({
            msg: err
        });
    }
}

const mostrarImagen = async(req = request, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: `La colección: ${coleccion} no es permitida!`
            });
    }


    if (modelo.img) {
        const pathFile = path.join( __dirname, '../uploads/', coleccion, modelo.img );

        if (fs.existsSync(pathFile)) {
            return res.sendFile(pathFile);
        }
    }


    // default
    const pathFile = path.join( __dirname, '../public/', 'assets', 'no-image.jpg');

    if (fs.existsSync(pathFile)) {
        return res.sendFile(pathFile);
    }


    return res.json({
        msg: "No hay imagen por default",
        pathFile
    });
}

const actualizarImagenCloudinary = async( req = request, res = response ) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con el id: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: `La colección: ${coleccion} no es permitida!`
            });
    }

    
    //limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }


    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;

        await modelo.save();

        
        return res.json({
            msg: 'Se guardo imagen correctamente',
            data: modelo
        });
    } catch(err) {
        return res.status(400).json({
            msg: err
        });
    }
}


module.exports = {
    uploadFile,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}