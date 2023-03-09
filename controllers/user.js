const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {
    const { nombre, apikey, page = 1, limit = 10 } = req.query;

    res.json({
        msg: "GET API - Controlador",
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req = request, res = response) => {
    const { nombre, edad } = req.body;

    res.status(201).json({
        msg: "POST API - Controlador",
        nombre,
        edad
    });
}

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;

    res.json({
        msg: "PUT API - Controlador",
        id
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: "DELETE API - Controlador"
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