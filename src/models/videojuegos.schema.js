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
  },
  imagen: {
    type: String,
    default: "",
  },
  trailer: {
    type: String,
    default: "",
    trim: true,
  },
  plataformas: {
    type: [String],
    enum: [
      "PC",
      "PlayStation 4",
      "Xbox One",
      "Nintendo Switch",
      "PlayStation 5",
      "Xbox Series X",
      "PlayStation 3",
      "Xbox 360",
    ],
  },
  genero: {
    type: [String],
    enum: ["Acción", "Aventura", "Estrategia", "Deportes", "Simulación"],
    required: true,
  },
  fechaLanzamiento: {
    type: Date,
    required: true,
  },
  version: {
    type: String,
    trim: true,
  },
  calificacion: {
    type: Number,
    min: [0, "Calificación mínima es 0"],
    max: [10, "Calificación máxima es 10"],
  },
  habilitado: {
    type: Boolean,
    default: true,
  },
});

VideojuegoSchema.methods.toJSON = function(){
    const {__v, ...videojuego } = this.toObject()
    return videojuego 
  }

const VideojuegoModel = model("videojuegos", VideojuegoSchema);
module.exports = VideojuegoModel;


