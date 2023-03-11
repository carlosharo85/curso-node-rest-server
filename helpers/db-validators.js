const Rol = require('../models/rol');
const Usuario = require('../models/usuario');


// Validaciones de Roles
const rolValidarNombre = async(rol = '') => {
    const existe = await Rol.findOne({ nombre: rol });

    if (!existe) {
        throw new Error(`El rol ${rol} no está registrado`);
    }
}


// Validaciones de Usuario
const usuarioExistsId = async(id = '') => {
    const existe = await Usuario.findById(id);

    if (!existe) {
        throw new Error(`El ID ${id} no está registrado`);
    }
}


const usuarioExistsEmail = async(email = '') => {
    const existe = await Usuario.findOne({ email });

    if (existe) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}


module.exports = {
    rolValidarNombre,
    
    usuarioExistsId,
    usuarioExistsEmail
}