const UsuarioModel = require("../models/usuarios.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../helpers/cloudinary");
const { registroUsuario, recuperoContraseniaUsuario } = require("../helpers/mensajes");

const nuevoUsuario = async (body) => {
  try {
    const usuarioExiste = await UsuarioModel.findOne({
      nombreUsuario: body.nombreUsuario,
    });

    if (usuarioExiste) {
      return {
        status: 400,
        msg: "El nombre de usuario ya está en uso. Por favor, elige otro."
      };
    }

    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);
    
    registroUsuario()
    const usuario = new UsuarioModel(body);
    await usuario.save();

    return {
      status: 201,
      msg: "Usuario registrado exitosamente."
    };
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return {
      status: 500,
      msg: "Ocurrió un error al registrar el usuario. Inténtalo de nuevo más tarde."
    };
  }
};

const inicioSesion = async (body) => {
  try {
    const usuarioExiste = await UsuarioModel.findOne({
      nombreUsuario: body.nombreUsuario,
    });

    if (!usuarioExiste) {
      return {
        code: 400,
        msg: "Nombre de usuario no encontrado. Por favor, verifica tus credenciales."
      };
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
        msg: "Inicio de sesión exitoso.",
        token,
        _id: usuarioExiste._id,
        rol: usuarioExiste.rol
      };
    } else {
      return {
        code: 400,
        msg: "Contraseña incorrecta. Intenta nuevamente."
      };
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return {
      code: 500,
      msg: "Ocurrió un error al intentar iniciar sesión. Por favor, intenta más tarde."
    };
  }
};


const obtenerTodosLosUsuarios = async () => {
  try {
    const usuarios = await UsuarioModel.find();
    if (usuarios.length === 0) {
      return {
        msg: 'No se encontraron usuarios en la base de datos.',
        statusCode: 404
      };
    }
    return {
      msg: 'Usuarios obtenidos exitosamente.',
      statusCode: 200,
      usuarios
    };
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return {
      msg: 'Ocurrió un error al intentar obtener los usuarios.',
      statusCode: 500,
      error: error.message
    };
  }
};

const obtenerUnUsuario = async (idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario);
    if (!usuario) {
      return {
        msg: 'No se encontró un usuario con el ID proporcionado.',
        statusCode: 404
      };
    }
    return {
      msg: 'Usuario obtenido exitosamente.',
      statusCode: 200,
      usuario
    };
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return {
      msg: 'Ocurrió un error al intentar obtener el usuario.',
      statusCode: 500,
      error: error.message
    };
  }
};


const actualizarUsuario = async (idUsuario, body) => {
  try {
    const usuarioActualizado = await UsuarioModel.findByIdAndUpdate({ _id: idUsuario }, body, { new: true });

    if (!usuarioActualizado) {
      return {
        msg: 'No se encontró un usuario con el ID proporcionado.',
        statusCode: 404
      };
    }

    return {
      msg: 'El usuario ha sido actualizado exitosamente.',
      statusCode: 200,
      usuario: usuarioActualizado
    };
  } catch (error) {
    return {
      msg: 'Ocurrió un error al intentar actualizar el usuario. Por favor, verifica los datos enviados.',
      statusCode: 500,
      error: error.message
    };
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

// Servicio para solicitar el restablecimiento de la contraseña
const solicitarRestablecimientoContrasenia = async (email) => {
  try {
    // Buscar el usuario por correo electrónico
    const user = await UsuarioModel.findOne({ email });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Generar un token JWT con expiración de 1 hora
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Llamar al servicio de nodemailer para enviar el correo
    const response = await recuperoContraseniaUsuario(token, email);
    return response;

  } catch (error) {
    throw new Error(error.message);
  }
};

// Servicio para cambiar la contraseña
const cambiarContrasenia = async (token, newPassword) => {
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario por ID extraído del token
    const user = await UsuarioModel.findById(decoded.id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario
    user.contrasenia = hashedPassword;
    await user.save();

    return { message: 'Contraseña actualizada con éxito' };
  } catch (error) {
    throw new Error(error.message || 'Error al cambiar la contraseña');
  }
};


module.exports = {
  nuevoUsuario,
  inicioSesion,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  actualizarUsuario,
  eliminarUsuario,
  habilitarUsuario,
  deshabilitarUsuario,
  fotoPerfil,
  solicitarRestablecimientoContrasenia,
  cambiarContrasenia
};
