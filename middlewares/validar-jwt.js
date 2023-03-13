const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_JWT);

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en DB"
            });
        }

        // verificar si el usuario tiene el status en true
        if (!usuario.status) {
            return res.status(401).json({
                msg: "Token no válido - usuario borrado"
            });
        }

        req.usuario = usuario;

        next();
    } catch(error) {
        console.log(error);
        return res.status(401).json({
            msg: "Token no válido"
        });
    }
}

module.exports = {
    validarJWT
}