const VideojuegoModel = require("../models/videojuegos.schema");
const cloudinary = require("../helpers/cloudinary");
const UsuarioModel = require("../models/usuarios.schema");
const mongoose = require("mongoose");
const configHeaderWhatsApp = require("../helpers/configMeta");

const obtenerTodosLosVideojuegos = async (limit, to) => {
  const [videojuegos, cantidadTotal] = await Promise.all([
    VideojuegoModel.find({ habilitado: true })
      .skip(to * limit)
      .limit(limit),
    VideojuegoModel.countDocuments({ habilitado: true }),
  ]);

  const paginacion = {
    videojuegos,
  };

  return paginacion;
};

const obtenerUnVideojuego = async (id) => {
  const videojuego = await VideojuegoModel.findById({ _id: id });
  return videojuego;
};

const buscarVideojuego = async (termino) => {
  const reglaBusqueda = new RegExp(termino, "i");
  const videojuegos = await VideojuegoModel.find({
    $or: [{ nombre: reglaBusqueda }, { descripcion: reglaBusqueda }],
  });
  return videojuegos;
};

const nuevoVideojuego = (body) => {
  try {
    const newVideojuego = new VideojuegoModel(body);
    return newVideojuego;
  } catch (error) {
    console.log(error);
  }
};

const editarVideojuego = async (idVideojuego, body) => {
  try {
    const videojuegoEditado = await VideojuegoModel.findByIdAndUpdate(
      { _id: idVideojuego },
      body,
      { new: true }
    );
    return videojuegoEditado;
  } catch (error) {
    console.log(error);
  }
};

const eliminarVideojuego = async (idVideojuego) => {
  try {
    await VideojuegoModel.findByIdAndDelete({ _id: idVideojuego });
    return 200;
  } catch (error) {
    console.log(error);
  }
};

const habilitarDeshabilitarJuego = async (idVideojuego) => {
  try {
    const videojuego = await VideojuegoModel.findById(idVideojuego);
    if (!videojuego) {
      return {
        msg: "Videojuego no encontrado.",
        statusCode: 404,
      };
    }

    videojuego.habilitado = !videojuego.habilitado;
    await videojuego.save();

    return {
      msg: `El videojuego "${videojuego.nombre}" ha sido ${
        videojuego.habilitado ? "habilitado" : "deshabilitado"
      } correctamente.`,
      statusCode: 200,
      videojuego,
    };
  } catch (error) {
    return {
      msg: "Ocurrió un error al cambiar el estado del videojuego.",
      statusCode: 500,
    };
  }
};

const cargarImagenVideojuego = async (idVideojuego, file) => {
  try {
    const videojuego = await VideojuegoModel.findById(idVideojuego);
    const imagen = await cloudinary.uploader.upload(file.path);
    videojuego.imagen = imagen.url;
    await videojuego.save();

    return {
      msg: "Imagen del videojuego cargada correctamente",
      statusCode: 200,
    };
  } catch (error) {
    return {
      msg: "Error al cargar la imagen",
      statusCode: 500,
      error,
    };
  }
};

const agregarJuegoACarrito = async (idVideojuego, idUsuario) => {
  try {
    const videojuego = await VideojuegoModel.findById(idVideojuego);
    const usuario = await UsuarioModel.findById(idUsuario);
    usuario.carrito.push(videojuego);
    await usuario.save();
    return {
      msg: "Videojuego agregado al carrito",
      statusCode: 200,
    };
  } catch (error) {
    return {
      msg: "Error al agregar el videojuego al carrito",
      statusCode: 500,
      error,
    };
  }
};

const borrarJuegoDelCarrito = async (idVideojuego, idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario);
    const videojuegoExistente = await usuario.carrito.find(
      (juego) => juego._id.toString() === idVideojuego
    );
    if (videojuegoExistente) {
      const posicionVideojuego = usuario.carrito.findIndex(
        (videoJuego) => videoJuego._id.toString() === idVideojuego
      );
      usuario.carrito.splice(posicionVideojuego, 1);
      await usuario.save();
      return {
        msg: "Sacaste el videojuego del carrito",
        statusCode: 200,
      };
    } else {
      return {
        msg: "No se encontró el videojuego en el carrito",
        statusCode: 404,
      };
    }
  } catch (error) {
    return {
      msg: "Error al borrar el videojuego del carrito",
      statusCode: 500,
      error,
    };
  }
};

const mostrarVideojuegoEnCarrito = async (idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario);
    return {
      carrito: usuario.carrito,
      statusCode: 200,
    };
  } catch (error) {
    return {
      msg: "Error al mostrar los videojuegos en el carrito",
      statusCode: 500,
      error,
    };
  }
};

const agregarJuegoAFavoritos = async (idVideojuego, idUsuario) => {
  try {
    const videojuego = await VideojuegoModel.findById(idVideojuego);
    const usuario = await UsuarioModel.findById(idUsuario);
    const videojuegoRepetido = usuario.favoritos.find(
      (juego) => juego._id.toString() === idVideojuego
    );
    if (!videojuegoRepetido) {
      usuario.favoritos.push(videojuego);
      await usuario.save();
      return {
        msg: "Videojuego marcado como favorito",
        statusCode: 200,
      };
    } else {
      return {
        msg: "El videojuego ya se marcó como favorito",
        statusCode: 500,
      };
    }
  } catch (error) {
    return {
      msg: "Error al marcar el videojuego como favorito",
      statusCode: 500,
      error,
    };
  }
};

const borrarJuegoDeFavoritos = async (idVideojuego, idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario);
    const videojuegoExistente = await usuario.favoritos.find(
      (juego) => juego._id.toString() === idVideojuego
    );
    if (videojuegoExistente) {
      const posicionVideojuego = usuario.favoritos.findIndex(
        (videoJuego) => videoJuego._id.toString() === idVideojuego
      );
      usuario.favoritos.splice(posicionVideojuego, 1);
      await usuario.save();
      return {
        msg: "Sacaste el videojuego de tus favoritos",
        statusCode: 200,
      };
    } else {
      return {
        msg: "No se encontró el videojuego en tus favoritos",
        statusCode: 404,
      };
    }
  } catch (error) {
    return {
      msg: "Error al borrar el videojuego de favoritos",
      statusCode: 500,
      error,
    };
  }
};

const mostrarVideojuegosFavoritos = async (idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario);
      return {
        favoritos: usuario.favoritos,
        statusCode: 200,
      };
  } catch (error) {
    return {
      msg: "Error al mostrar los videojuegos favoritos",
      statusCode: 500,
      error,
    };
  }
};

const enviarMensajeWhatsapp = async (telefono, plantilla, token, codigo) => {
  const telefonoId = process.env.META_TEL_ID;
  const url = `https://graph.facebook.com/v20.0/${telefonoId}/messages`;
  const code = codigo || "en_US";

  const mensaje = {
    messaging_product: "whatsapp",
    to: telefono,
    type: "template",
    template: {
      name: plantilla,
      language: { code: code },
    },
  };

  try {
    const response = await fetch(url, configHeaderWhatsApp(token, mensaje));
    const data = await response.json();

    if (response.ok) {
      return {
        msg: `Mensaje enviado correctamente a ${telefono}`,
        data,
        statusCode: 200,
      };
    } else {
      console.error(`Error al enviar el mensaje: ${data.error.message}`);
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error(`Error en la solicitud: ${error.message}`);
    throw error;
  }
};

module.exports = {
  obtenerTodosLosVideojuegos,
  obtenerUnVideojuego,
  nuevoVideojuego,
  editarVideojuego,
  eliminarVideojuego,
  buscarVideojuego,
  habilitarDeshabilitarJuego,
  cargarImagenVideojuego,
  agregarJuegoACarrito,
  borrarJuegoDelCarrito,
  mostrarVideojuegoEnCarrito,
  enviarMensajeWhatsapp,
  agregarJuegoAFavoritos,
  borrarJuegoDeFavoritos,
  mostrarVideojuegosFavoritos,
};
