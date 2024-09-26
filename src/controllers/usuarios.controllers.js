const serviceUsuario = require('../services/usuarios.sevices')
const { validationResult } = require('express-validator')

const registrarUsuario = async (req, res) => {
  try {
    const { errors } = validationResult(req)

    if (errors.length) {
      return res.status(400).json({ msg: errors[0].msg })
    }

    const result = await serviceUsuario.nuevoUsuario(req.body)
    if (result === 201) {
      res.status(201).json({ msg: 'Usuario registrado con exito' })
    }else if(result === 409){
      res.status(409).json({msg:'Error al crear: Rol incorrecto. Solo se puede ser usuario o admin'})
    }
  } catch (error) {
    console.log(error)
  }
}

const iniciarSesionUsuario = async (req, res) => {
  try {
    const result = await serviceUsuario.inicioSesion(req.body)

    if (result.code === 400) {
      res.status(400).json({ msg: 'Usuario y/o contraseña incorrecto' })
    } else {
      res.status(200).json({ msg: 'Usuario inicio sesion', token: result.token })
    }
  } catch (error) {
    console.log(error)
  }
}

const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await serviceUsuario.obtenerTodosLosUsuarios()
    res.status(200).json(usuarios)
  } catch (error) {
    console.log(error)
  }
}

const obtenerUnUsuario = async (req, res) => {
  try {
    const { errors } = validationResult(req)
    
    if (errors.length) {
      return res.status(400).json({ msg: errors[0].msg })
    }
    
    const usuario = await serviceUsuario.obtenerUnUsuario(req.params.idUsuario)
    res.status(200).json({ msg: 'Usuario encontrado', usuario })
  } catch (error) {
    console.log(error)
  }
}

const eliminarUnUsuario = async (req, res) => {
  const result = await serviceUsuario.eliminarUsuario(req.params.idUsuario);
  
  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg, usuarios: result.usuarios });
  } else if (result.statusCode === 404) {
    res.status(404).json({ msg: result.msg });
  } else {
    res.status(500).json({ msg: result.msg });
  }
}


const cambiarEstadoUsuario= async (req, res) => {
  const { idUsuario, accion } = req.params; 
  
  let result;
  if (accion === 'habilitar') {
    result = await serviceUsuario.habilitarUsuario(idUsuario);
  } else if (accion === 'deshabilitar') {
    result = await serviceUsuario.deshabilitarUsuario(idUsuario);
  } else {
    return res.status(400).json({ msg: 'Acción no válida' });
  }

  if (result.statusCode === 200) {
    res.status(200).json({ msg: result.msg });
  } else {
    res.status(400).json({ msg: result.msg });
  }
};


const agregarFotoPerfil = async (req, res) => {
  const result =  await serviceUsuario.fotoPerfil(req.params.idUsuario, req.file)
  if(result.statusCode === 200){
    res.status(200).json({msg: result.msg})
   }else{
    res.status(500).json({msg: result.msg})
   }
}

module.exports = {
  registrarUsuario,
  iniciarSesionUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  eliminarUnUsuario,
  cambiarEstadoUsuario,
  agregarFotoPerfil
  
}