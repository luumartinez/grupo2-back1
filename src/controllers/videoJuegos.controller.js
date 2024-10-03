const { validationResult } = require("express-validator");
const serviciosVideojuegos = require("../services/videoJuegos.services");

const obtenerUnVideojuegoPorIdOTodos = async (req, res) => {
  try {
    const id = req.query.id;
    const limit = req.query.limit || 10;
    const to = req.query.to || 0;

    if (id) {
      const videojuego = await serviciosVideojuegos.obtenerUnVideojuego(id);
      res.status(200).json(videojuego);
    } else {
      const videojuegos = await serviciosVideojuegos.obtenerTodosLosVideojuegos(
        limit,
        to
      );
      res.status(200).json(videojuegos);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const crearVideojuego = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.status(400).json({ msg: errors[0].msg });
    }

    const nuevoVideojuego = await serviciosVideojuegos.nuevoVideojuego(
      req.body
    );
    await nuevoVideojuego.save();
    res
      .status(201)
      .json({ msg: "Videojuego creado correctamente", nuevoVideojuego });
  } catch (error) {
    res.status(500).json(error);
  }
};

const editarVideojuegoPorId = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.status(400).json({ msg: errors[0].msg });
    }

    const id = req.params.idVideojuego;
    const videojuegoActualizado = await serviciosVideojuegos.editarVideojuego(
      id,
      req.body
    );
    res
      .status(200)
      .json({
        msg: "Videojuego actualizado correctamente",
        videojuegoActualizado,
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

const eliminarVideojuegoPorId = async (req, res) => {
  try {
    const id = req.params.idVideojuego;
    const response = await serviciosVideojuegos.eliminarVideojuego(id);

    if (response === 200) {
      res.status(200).json({ msg: "Videojuego eliminado" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const buscarVideojuegoPorTermino = async (req, res) => {
  try {
    const resultado = await serviciosVideojuegos.buscarVideojuego(
      req.query.termino
    );
    res.json(resultado);
  } catch (error) {
    console.log(error);
  }
};

const habilitarDeshabilitarJuegoPorId = async (req, res) => {
  const result = await serviciosVideojuegos.habilitarDeshabilitarJuego(
    req.params.idVideojuego
  );
  res
    .status(result.statusCode)
    .json({ msg: result.msg, videojuego: result.videojuego });
};

const imagenVideojuego = async (req, res) => {
  const result = await serviciosVideojuegos.cargarImagenVideojuego(
    req.params.idVideojuego,
    req.file
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const videojuegoAlCarrito = async (req, res) => {
  const result = await serviciosVideojuegos.agregarJuegoACarrito(
    req.params.idVideojuego,
    req.idUsuario
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const sacarVideojuegoDelCarrito = async (req, res) => {
  const result = await serviciosVideojuegos.borrarJuegoDelCarrito(
    req.params.idVideojuego,
    req.idUsuario
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const verVideojuegoEnCarrito = async (req, res) => {
  const result = await serviciosVideojuegos.mostrarVideojuegoEnCarrito(
    req.idUsuario
  );
  if (result.statusCode === 200) {
    res.status(200).json({ carrito: result.carrito });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const marcarVideojuegoFavorito = async (req, res) => {
  const result = await serviciosVideojuegos.agregarJuegoAFavoritos(
    req.params.idVideojuego,
    req.idUsuario
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const sacarVideojuegoDeFavoritos = async (req, res) => {
  const result = await serviciosVideojuegos.borrarJuegoDeFavoritos(
    req.params.idVideojuego,
    req.idUsuario
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const verVideojuegosFavoritos = async (req, res) => {
  const result = await serviciosVideojuegos.mostrarVideojuegosFavoritos(
    req.idUsuario
  );
  if (result.statusCode === 200) {
    res.status(200).json({ favoritos: result.favoritos });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const enviarMensaje = async (req, res) => {
  const { telefono, plantilla, token, codigo } = req.body;

  try {
    const result = await serviciosVideojuegos.enviarMensajeWhatsapp(
      telefono,
      plantilla,
      token,
      codigo
    );
    if (result.statusCode === 200) {
      res.status(200).json({ msg: result.msg, data: result.data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el mensaje");
  }
};

const mercadoPago = async (req, res) => {
  const result = await serviciosVideojuegos.pagoVideojuegoConMp(req.body);

  if (result.statusCode === 200) {
    res
      .status(200)
      .json({
        msg: result.msg,
        urlMP: result.urlPay,
        urlPoint: result.urlPoint,
      });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const confirmarPago = async (req, res) => {
  const result = await serviciosVideojuegos.emailConfirmarPago(req.idUsuario);

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

module.exports = {
  obtenerUnVideojuegoPorIdOTodos,
  crearVideojuego,
  editarVideojuegoPorId,
  eliminarVideojuegoPorId,
  buscarVideojuegoPorTermino,
  habilitarDeshabilitarJuegoPorId,
  imagenVideojuego,
  videojuegoAlCarrito,
  sacarVideojuegoDelCarrito,
  verVideojuegoEnCarrito,
  enviarMensaje,
  marcarVideojuegoFavorito,
  sacarVideojuegoDeFavoritos,
  verVideojuegosFavoritos,
  mercadoPago,
  confirmarPago,
};
