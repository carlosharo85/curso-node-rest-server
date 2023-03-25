const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { uploadFile, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/upload');
const { coleccionesPermitidas } = require('../helpers/index');


router.post('/', [
    validarArchivoSubir,
    validarCampos
], uploadFile);

router.put('/:coleccion/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarArchivoSubir,
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
], mostrarImagen);


module.exports = router;