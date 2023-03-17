const { Schema, model } = require('mongoose');

const { getCapitalizado } = require('../helpers/strings');


const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    descripcion: {
        type: String,
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    usuarioUpdated: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

ProductoSchema.methods.toJSON = function() {
    const { _id, nombre, __v, ...resto } = this.toObject();

    return {
        uid: _id,
        nombre: getCapitalizado(nombre),
        ...resto
    };
}


module.exports = model('Producto', ProductoSchema);