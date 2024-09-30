const VideojuegoModel = require("../models/videojuegos.schema");
const cloudinary = require("../helpers/cloudinary");
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

const enviarMensajeWhatsapp = async (telefono, plantilla, token, codigo) => {
  const telefonoId = process.env.META_TEL_ID;
  const url = `https://graph.facebook.com/v20.0/${telefonoId}/messages`;
  const code = codigo || 'en_US';

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
        statusCode: 200
      }
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
  enviarMensajeWhatsapp,
};
