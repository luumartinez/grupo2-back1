const UsuarioModel = require("../models/usuarios.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../helpers/cloudinary");
const { registroUsuario } = require("../helpers/mensajes");

const nuevoUsuario = async (body) => {
  try {
    const usuarioExiste = await UsuarioModel.findOne({
      nombreUsuario: body.nombreUsuario,
    });

    if (usuarioExiste) {
      return 400;
    }

    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);
    registroUsuario();
    const usuario = new UsuarioModel(body);
    await usuario.save();

    return 201;
  } catch (error) {
    console.log(error);
  }
};

const inicioSesion = async (body) => {
  try {
    const usuarioExiste = await UsuarioModel.findOne({
      nombreUsuario: body.nombreUsuario,
    });

    if (!usuarioExiste) {
      return { code: 400 };
    }

    const verificacionContrasenia = bcrypt.compareSync(
      body.contrasenia,
      usuarioExiste.contrasenia
    );

    if (verificacionContrasenia) {
      const payload = {
        _id: usuarioExiste._id,
        rol: usuarioExiste.rol,
        bloqueado: usuarioExiste.bloqueado,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return {
        code: 200,
        token,
      };
    } else {
      return { code: 400 };
    }
  } catch (error) {
    console.log(error);
  }
};

const obtenerTodosLosUsuarios = async () => {
  try {
    const usuarios = await UsuarioModel.find();
    return usuarios;
  } catch (error) {
    console.log(error);
  }
};

const obtenerUnUsuario = async (idUsuario) => {
  try {
    const usuario = await UsuarioModel.findOne({ _id: idUsuario });
    return usuario;
  } catch (error) {
    console.log(error);
  }
};

const eliminarUsuario = async (idUsuario) => {
  try {
    const usuarioEliminado = await UsuarioModel.findByIdAndDelete({
      _id: idUsuario,
    });

    if (!usuarioEliminado) {
      return {
        msg: "Usuario no encontrado",
        statusCode: 404,
      };
    }

    const usuariosDb = await UsuarioModel.find();

    return {
      msg: "Usuario eliminado",
      usuarios: usuariosDb,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);

    return {
      msg: "Error al eliminar usuario",
      statusCode: 500,
      error: error.message || error,
    };
  }
};

const habilitarUsuario = async (idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario);
  usuario.bloqueado = false;
  console.log(idUsuario);
  await usuario.save();

  return {
    msg: "Usuario habilitado",
    statusCode: 200,
  };
};

const deshabilitarUsuario = async (idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario);
  usuario.bloqueado = true;
  await usuario.save();

  return {
    msg: "Usuario deshabilitado",
    statusCode: 200,
  };
};

const editarUsuario = async (idUsuario, datosActualizados) => {
  try {
    // Buscar el usuario por ID
    const usuario = await UsuarioModel.findById(idUsuario);

    // Verificar si el usuario existe
    if (!usuario) {
      return {
        msg: "Usuario no encontrado",
        statusCode: 404,
      };
    }

    // Actualizar los campos del usuario
    Object.keys(datosActualizados).forEach((key) => {
      usuario[key] = datosActualizados[key];
    });

    // Guardar los cambios
    await usuario.save();

    return {
      msg: "Usuario actualizado correctamente",
      statusCode: 200,
      usuario,
    };
  } catch (error) {
    return {
      msg: "Error al actualizar el usuario",
      statusCode: 500,
      error: error.message,
    };
  }
};

const fotoPerfil = async (idUsuario, file) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario);
    const imagen = await cloudinary.uploader.upload(file.path);
    usuario.foto = imagen.url;
    await usuario.save();

    return {
      msg: "Foto perfil cargada",
      statusCode: 200,
    };
  } catch (error) {
    return {
      msg: "Error al cargar foto de perfil",
      statusCode: 500,
      error,
    };
  }
};

module.exports = {
  nuevoUsuario,
  inicioSesion,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  eliminarUsuario,
  habilitarUsuario,
  deshabilitarUsuario,
  fotoPerfil,
  editarUsuario
};
