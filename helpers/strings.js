const getCapitalizado = (cadena = '') => {
    cadena = cadena.toLocaleLowerCase();
    
    return (cadena.split(' ').map( palabra => {
        if (palabra.length >= 3) {
            palabra = palabra.charAt(0).toLocaleUpperCase()+palabra.slice(1);
        }

        return palabra;
    })).join(' ');
}


module.exports = {
    getCapitalizado
}