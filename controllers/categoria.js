const { request, response } = require("express");

const { Categoria } = require('../models/index');


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {
    const { page = 0, limit = 3 } = req.body;
    const query = { status: true };


    const [ arrayCategorias, totales ] = await Promise.all([
        Categoria
            .find(query)
            .populate('usuarioUpdated', 'nombre')
            .skip(page * limit)
            .limit(limit),
        Categoria.countDocuments(query)
    ]);
    

    return res.json({
        msg: 'Listado de categorias',
        data: arrayCategorias,
        paginado: {
            page,
            limit,
            elem: arrayCategorias.length,
            total: totales
        }
    });
}

// obtenerCategoria - populate
const obtenerCategoria = async(req = request, res = response) => {
    const id = req.params.id;
    const categoria = await Categoria.findById(id).populate('usuarioUpdated', 'nombre');


    return res.json({
        msg: 'Obtener Categoria',
        data: categoria
    });
}


const crearCategoria = async(req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();


    const data = {
        nombre,
        usuarioUpdated: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();


    return res.status(201).json({
        msg: 'Categoria Guardada!',
        data: {
            categoria
        }
    });
}


// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {
    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();

    const existeOtraCategoria = await Categoria.findOne({ nombre });


    if ( existeOtraCategoria && (existeOtraCategoria.id != id)) {
        return res.status(401).json({
            msg: `Ya existe la categoría: ${nombre}`
        });
    }

    const categoria = await Categoria.findByIdAndUpdate(id, {
        nombre,
        usuarioUpdated: req.usuario._id
    });


    return res.json({
        msg: 'Actualiza la Categoria',
        data: categoria
    });
}

// borrarCategoria - status: false
const borrarCategoria = async(req = request, res = response) => {
    const id = req.params.id;

    const categoria = await Categoria.findByIdAndUpdate(id, {
        status: false,
        usuarioUpdated: req.usuario._id
    });

    return res.json({
        msg: 'Categoría borrada!',
        data: categoria
    });
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}