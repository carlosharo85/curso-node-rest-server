const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const {
    validarCampos,
    validarJWT,
    esRoleAdmin
} = require('../middlewares/index');

const { 
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/producto');

const { 
    productoExistsId,
    productoExistsNombre,
    categoriaExistsId,
    categoriaIsActive
} = require('../helpers/db-validators');


// obtener todas los productos - publico
router.get('/', obtenerProductos);

// obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productoExistsId ),
    validarCampos,
], obtenerProducto);

// crear producto - privado - cualquiera con token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( productoExistsNombre ),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom( categoriaExistsId ),
    check('categoria').custom( categoriaIsActive ),
    validarCampos
], crearProducto);

// actualizar producto - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productoExistsId ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom( categoriaExistsId ),
    check('categoria').custom( categoriaIsActive ),
    validarCampos
], actualizarProducto);

// borrar producto - privado - solo admin
router.delete('/:id', [
    validarJWT,
    esRoleAdmin,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productoExistsId ),
    validarCampos
], borrarProducto);


module.exports = router;