const {
    Rol,
    Usuario,
    Categoria,
    Producto
 } = require('../models/index');


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


// Validaciones de Categoria
const categoriaExistsId = async(id = '') => {
    const existe = await Categoria.findById(id);

    if (!existe) {
        throw new Error(`El ID ${id} no está registrado`);
    }
}

const categoriaExistsNombre = async(nombre = '') => {
    const existe = await Categoria.findOne({ nombre: nombre.toLocaleUpperCase() });

    if (existe) {
        throw new Error(`El nombre ${nombre} ya está registrado`);
    }
}

const categoriaIsActive = async(id = '') => {
    const categoria = await Categoria.findById(id);

    if (!categoria.status) {
        throw new Error(`La categoria no está disponible`);
    }
}


// Validaciones de Producto
const productoExistsId = async(id = '') => {
    const existe = await Producto.findById(id);

    if (!existe) {
        throw new Error(`El ID ${id} no está registrado`);
    }
}

const productoExistsNombre = async(nombre = '') => {
    const existe = await Producto.findOne({ nombre: nombre.toLocaleUpperCase() });

    if (existe) {
        throw new Error(`El nombre ${nombre} ya está registrado`);
    }
}


module.exports = {
    rolValidarNombre,
    
    usuarioExistsId,
    usuarioExistsEmail,

    categoriaExistsId,
    categoriaExistsNombre,
    categoriaIsActive,

    productoExistsId,
    productoExistsNombre
}