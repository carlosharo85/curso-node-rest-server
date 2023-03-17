const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../middlewares/index');

const { 
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categoria');

const { 
    categoriaExistsId,
    categoriaExistsNombre
} = require('../helpers/db-validators');


// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoriaExistsId ),
    validarCampos,
], obtenerCategoria);

// crear categoria - privado - cualquiera con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( categoriaExistsNombre ),
    validarCampos
], crearCategoria);

// actualizar categoria - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoriaExistsId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// borrar categoria - privado - solo admin
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoriaExistsId ),
    validarCampos
], borrarCategoria);


module.exports = router;