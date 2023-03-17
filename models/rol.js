const { Schema, model } = require('mongoose');


const RolSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});


module.exports = model('Role', RolSchema);