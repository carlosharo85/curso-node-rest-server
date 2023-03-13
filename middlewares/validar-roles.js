const { request, response } = require("express")


const esRoleAdmin = ( req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Aún no hay un usuario autenticado'
        });
    }

    const { nombre, rol } = req.usuario;

    if (rol !== 'ADMIN') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador`
        });
    }

    next();
}

const tieneRol = ( ...roles ) => {
    return (req = request, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Aún no hay un usuario autenticado'
            });
        }
    
        const { nombre, rol } = req.usuario;
    
        if (!roles.includes(rol)) {
            return res.status(401).json({
                msg: `${ nombre } requiere uno de estos roles: ${ roles }`
            });
        }
    
        next();
    }
}


module.exports = {
    esRoleAdmin,
    tieneRol
}