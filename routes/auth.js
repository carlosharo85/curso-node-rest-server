const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);


module.exports = router;