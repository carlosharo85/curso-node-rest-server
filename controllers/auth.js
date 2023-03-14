const { request, response } = require("express");
const bcriptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


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


const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            // tengo que crearlo
            const data = {
                nombre,
                email,
                password: 'googleAuth',
                img,
                rol: 'USER',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el usuario en DB esta con status false
        if (!usuario.status) {
            return res.status(401).json({
                msg: 'Hable con el Administrador, usuario bloqueado'
            });
        }

        //genera el JWT
        const token = await generarJWT(usuario.id);


        return res.json({
            msg: 'Login Google',
            data: {
                usuario,
                token
            }
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error en authenticación con Google'
        });
    }
}


module.exports = {
    login,
    googleSignIn
}