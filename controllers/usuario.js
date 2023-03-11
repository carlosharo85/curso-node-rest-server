const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {
    const { page = 0, limit = 10 } = req.query;
    const query = { status: true };


    /*const usuarios = await Usuario
        .find(query)
        .skip(desde)
        .limit(limit);

    const contUsuarios = await Usuario.countDocuments(query);*/

    const [ contUsuarios, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario
            .find(query)
            .skip(page * limit)
            .limit(limit)
    ]);


    res.json({
        msg: "GET API - Controlador",
        data: usuarios,
        paginacion: {
            page,
            limit,
            elem: usuarios.length,
            total: contUsuarios
        }
    });
}


const usuariosPost = async (req = request, res = response) => {
    const { nombre, email, password, rol} = req.body;
    const usuario = new Usuario({ nombre, email, password, rol });


    // encriptar el password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    // guardar en DB
    await usuario.save();


    res.status(201).json({
        msg: "POST API - Controlador",
        usuario
    });
}


const usuariosPut = async(req = request, res = response) => {
    const id = req.params.id;
    const { _id, email, password, google, ...resto } = req.body;

    // TODO validar contra base de datos
    if ( password ) {
        // encriptar el password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: "PUT API - Controlador",
        usuario
    });
}


const usuariosDelete = async(req = request, res = response) => {
    const { id } = req.params;

    // Borrado fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, { status: false });


    res.json({
        msg: "DELETE API - Controlador",
        usuario
    });
}


const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: "PATCH API - Controlador"
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}