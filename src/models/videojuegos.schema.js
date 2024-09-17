const { Schema, model } = require("mongoose");

const VideojuegoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    min: [5, "Minimo permitido 5 caracteres"],
    max: [50, "Maximo permitido 50 caracteres"],
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    min: [5, "Minimo permitido 5 caracteres"],
    max: [500, "Maximo permitido 500 caracteres"],
  },
  precio: {
    type: Number,
    required: true,
    min: [0, "El precio no puede ser negativo"],
    max: [999999, "El precio no puede ser mayor a 999999"],
  }
});

