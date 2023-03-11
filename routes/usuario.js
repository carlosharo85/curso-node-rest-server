const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuario');
const { validarCampos } = require('../middlewares/validar-campos');
const { rolValidarNombre, usuarioExistsId, usuarioExistsEmail } = require('../helpers/db-validators');


router.get('/', usuariosGet);


router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser más de 6 caracteres').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( usuarioExistsEmail ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN', 'USER']),
    check('rol').custom( rolValidarNombre ),
    validarCampos
], usuariosPost);


router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( usuarioExistsId ),
    check('rol').custom( rolValidarNombre ),
    validarCampos
], usuariosPut);


router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( usuarioExistsId ),
    validarCampos
], usuariosDelete);


router.patch('/', usuariosPatch);


module.exports = router;