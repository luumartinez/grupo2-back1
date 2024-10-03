const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config(); // Asegúrate de cargar las variables de entorno

try {
  mongoose.connect(process.env.MONGO_CONNECT).then(() => {
    console.log("Base de datos conectada");
  });
} catch (error) {
  console.log("Error al conectar");
}

module.exports = mongoose;