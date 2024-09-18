const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    require: true,
    trim: true,
    min: [3, "El nombre debe tener por lo menos 3 caracteres"],
    max: [25, "El nombre NO debe tener más de 25 caracteres"],
  },
  apellido: {
    type: String,
    require: true,
    trim: true,
    min: [3, "El apellido debe tener por lo menos 3 caracteres"],
    max: [25, "El apellido NO debe tener más de 25 caracteres"],
  },
  nombreUsuario: {
    type: String,
    require: true,
    trim: true,
    min: [3, "El nombre de usuario debe tener por lo menos 3 caracteres"],
    max: [20, "El nombre de usuario NO debe tener más de 20 caracteres"],
  },
  email: {
    type: String,
    require: true,
    min: [10, "El nombre de usuario debe tener por lo menos 10 caracteres"],
  },
  contrasenia: {
    type: String,
    require: true,
    min: [8, "La contraseña debe tener por lo menos 8 caracteres"],
    max: [20, "La contraseña NO debe tener más de 20 caracteres"],
  },
  rol: {
    type: String,
    default: "usuario",
    enum: ["admin", "usuario"],
  },
  bloqueado: {
    type: Boolean,
    default: false,
  },
  favoritos: {
    type: Array,
  },
  carrito: {
    type: Array,
  },
});

UsuarioSchema.method.toJSON = function() {
    const {contrasenia, _v, ...usuario} = this.toObject();
    return usuario;
}

const UsuarioModel = model("usuarios", UsuarioSchema);
module.exports = UsuarioModel;
