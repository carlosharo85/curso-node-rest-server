const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true
        //enum: ['ADMIN', 'USER']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


// tiene que ser funcion normal y no de flecha
UsuarioSchema.methods.toJSON = function() {
    const { _id, __v, password, ...resto } = this.toObject();
    
    return {
        uid: _id,
        ...resto
    };
}


module.exports = model('Usuario', UsuarioSchema);