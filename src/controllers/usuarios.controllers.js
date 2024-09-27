const serviceUsuario = require("../services/usuarios.sevices");
const { validationResult } = require("express-validator");

const registrarUsuario = async (req, res) => {
  try {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.status(400).json({ msg: errors[0].msg });
    }

    console.log('Datos recibidos para registrar usuario:', req.body);

    const result = await serviceUsuario.nuevoUsuario(req.body);

    if (result.status === 201) {
      res.status(201).json({ msg: result.msg });
    } else if (result.status === 400) {
      res.status(400).json({ msg: result.msg });
    } else {
      res.status(500).json({ msg: result.msg });
    }
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};


const iniciarSesionUsuario = async (req, res) => {
  try {
    const result = await serviceUsuario.inicioSesion(req.body);

    if (result.code === 400) {
      res.status(400).json({ msg: result.msg });
    } else if (result.code === 200){
      res.status(200).json({ msg: result.msg , token: result.token, rol: result.rol,
        idUsuario:result._id});
    }else {
      res.status(500).json({ msg: result.msg });
    }
  } catch (error) {
    console.log(error);
  }
};

const obtenerTodosLosUsuarios = async (req, res) => {
  const result = await serviceUsuario.obtenerTodosLosUsuarios();

  if (result.statusCode === 200) {
    res.status(200).json({ usuarios: result.usuarios, msg: result.msg });
  } else if (result.statusCode === 404) {
    res.status(404).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const obtenerUnUsuario = async (req, res) => {
  const result = await serviceUsuario.obtenerUnUsuario(req.params.idUsuario);

  if (result.statusCode === 200) {
    res.status(200).json({ usuario: result.usuario, msg: result.msg });
  } else if (result.statusCode === 404) {
    res.status(404).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const eliminarUnUsuario = async (req, res) => {
  const result = await serviceUsuario.eliminarUsuario(req.params.idUsuario);

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg, usuarios: result.usuarios });
  } else if (result.statusCode === 404) {
    res.status(404).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const editarUsuario = async (req, res) => {
  const result = await serviceUsuario.actualizarUsuario(
    req.params.idUsuario,
    req.body
  );

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else if (result.statusCode === 404) {
    res.status(404).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  const { idUsuario, accion } = req.params;

  let result;
  if (accion === "habilitar") {
    result = await serviceUsuario.habilitarUsuario(idUsuario);
  } else if (accion === "deshabilitar") {
    result = await serviceUsuario.deshabilitarUsuario(idUsuario);
  } else {
    return res.status(400).json({ msg: "Acción no válida" });
  }

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(400).json({ msg: result.msg });
  }
};

const agregarFotoPerfil = async (req, res) => {
  const result = await serviceUsuario.fotoPerfil(
    req.params.idUsuario,
    req.file
  );
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesionUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  editarUsuario,
  eliminarUnUsuario,
  cambiarEstadoUsuario,
  agregarFotoPerfil,
};
