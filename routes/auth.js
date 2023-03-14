const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);


router.post('/google', [
    check('id_token', 'Token de Google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;