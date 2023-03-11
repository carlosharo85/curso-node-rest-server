const mongoose = require('mongoose');


const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB_ATLAS);

        console.log('Base de datos de MongoDB online.');
    } catch(error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos');
    }
}

module.exports = {
    dbConnection
}