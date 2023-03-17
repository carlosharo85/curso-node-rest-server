const { request, response } = require("express");

const { Producto } = require('../models/index');


const obtenerProductos = async(req = request, res = response) => {
    const { page = 0, limit = 3 } = req.body;
    const query = { status: true };


    const [ arrayProductos, totales ] = await Promise.all([
        Producto
            .find(query)
            .populate('categoria', 'nombre')
            .populate('usuarioUpdated', 'nombre')
            .skip(page * limit)
            .limit(limit),
        Producto.countDocuments(query)
    ]);


    return res.json({
        msg: 'Listado de productos',
        data: arrayProductos,
        paginado: {
            page,
            limit,
            elem: arrayProductos.length,
            total: totales
        }
    });
}

const obtenerProducto = async(req = request, res = response) => {
    const id = req.params.id;
    const producto = await Producto
        .findById(id)
        .populate('categoria', 'nombre')
        .populate('usuarioUpdated', 'nombre');


    return res.json({
        msg: 'Obtener Producto',
        data: producto
    });
}

const crearProducto = async(req = request, res = response) => {
    const { descripcion = '', precio = 0, categoria } = req.body;
    const usuario = req.usuario._id;
    const nombre = req.body.nombre.toUpperCase();


    const data = {
        nombre,
        descripcion,
        precio,
        categoria,
        usuarioUpdated: usuario
    }

    const producto = new Producto(data);
    await producto.save();


    return res.status(201).json({
        msg: 'Producto Guardado!',
        data: {
            producto
        }
    });
}

const actualizarProducto = async(req = request, res = response) => {
    const id = req.params.id;
    let { nombre, ...resto } = req.body;
    nombre = nombre.toUpperCase();


    const existeOtroProducto = await Producto.findOne({ nombre });


    if ( existeOtroProducto && (existeOtroProducto.id != id)) {
        return res.status(401).json({
            msg: `Ya existe el producto: ${nombre}`
        });
    }

    const producto = await Producto.findByIdAndUpdate(id, {
        nombre,
        ...resto,
        usuarioUpdated: req.usuario._id
    });


    return res.json({
        msg: 'Actualiza Producto',
        data: producto
    });
}

const borrarProducto = async(req = request, res = response) => {
    const id = req.params.id;

    const producto = await Producto.findByIdAndUpdate(id, {
        status: false,
        usuarioUpdated: req.usuario._id
    });

    return res.json({
        msg: 'Producto borrado!',
        data: producto
    });
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}