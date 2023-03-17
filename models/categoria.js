const { Schema, model } = require('mongoose');

const { getCapitalizado } = require('../helpers/strings');


const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
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


CategoriaSchema.methods.toJSON = function() {
    const { _id, nombre, __v, ...resto } = this.toObject();

    return {
        uid: _id,
        nombre: getCapitalizado(nombre),
        ...resto
    };
}


module.exports = model('Categoria', CategoriaSchema);