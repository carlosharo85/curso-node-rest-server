const { request, response } = require("express");
const bcriptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req = request, res = response) => {
    const { email, password } = req.body;


    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        //si el usuario esta activo
        if (!usuario.status) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - status'
            });
        }

        //verificar contraseña
        const validarPassword = bcriptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //genera el JWT
        const token = await generarJWT(usuario.id);


        return res.json({
            msg: 'Login OK',
            data: {
                usuario,
                token
            }
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Contacte al Administrador'
        });
    }
}


module.exports = {
    login
}