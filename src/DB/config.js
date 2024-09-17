const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGO_CONNECT).then(() => {
    console.log("Base de datos conectada");
  });
} catch (error) {
  console.log("Error al conectar");
}

module.exports = mongoose;