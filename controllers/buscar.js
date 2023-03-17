const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const {
    Usuario,
    Categoria,
    Producto
} = require('../models/index');
const usuario = require("../models/usuario");

const coleccionesPermitidas = [
    'rol',
    'usuario',
    'categoria',
    'producto',
];


const buscarUsuario = async( termino = '', res = response ) => {
    const isMongoID = ObjectId.isValid(termino);

    if (isMongoID) {
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [
            { nombre: regex },
            { email: regex }
        ],
        $and: [{ status: true }]
    });

    return res.json({
        results: usuarios ? [usuarios] : []
    });
}

const buscarCategoria = async( termino = '', res = response ) => {
    const isMongoID = ObjectId.isValid(termino);

    if (isMongoID) {
        const categoria = await Categoria.findById(termino)
            .populate('usuarioUpdated', 'nombre');

        return res.json({
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({
        nombre: regex,
        status: true
    }).populate('usuarioUpdated', 'nombre');

    return res.json({
        results: categorias ? [categorias] : []
    });
}

const buscarProducto = async( termino = '', res = response ) => {
    const isMongoID = ObjectId.isValid(termino);

    if (isMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuarioUpdated', 'nombre');

        return res.json({
            results: producto ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        nombre: regex,
        status: true
    }).populate('categoria', 'nombre')
    .populate('usuarioUpdated', 'nombre');

    return res.json({
        results: productos ? [productos] : []
    });
}


const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }


    switch(coleccion) {
        case 'usuario':
            buscarUsuario(termino, res);
            break;
        case 'categoria':
            buscarCategoria(termino, res);
            break;
        case 'producto':
            buscarProducto(termino, res);
            break;
        default:
            return res.status(500).json({
                msg: 'Falta una busqueda'
            });
    }
}


module.exports = {
    buscar
}