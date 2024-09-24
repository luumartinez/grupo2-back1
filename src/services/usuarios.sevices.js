const UsuarioModel = require("../models/usuarios.schema")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../helpers/cloudinary')
const { registroUsuario } = require("../helpers/mensajes")
//const CarritoModel = require("../models/carrito.schema")
//const FavModel = require("../models/favoritos.schema")

const nuevoUsuario = async (body) => {
  try {
    const usuarioExiste = await UsuarioModel.findOne({ nombreUsuario: body.nombreUsuario })

    if (usuarioExiste) {
      return 400
    }

    if (body.rol !== 'usuario' && body.rol !== 'admin') {
      return 409
    }



    let salt = bcrypt.genSaltSync();
    body.contrasenia = bcrypt.hashSync(body.contrasenia, salt);


    //registroUsuario()
    const usuario = new UsuarioModel(body)
    // const carrito = new CarritoModel({idUsuario: usuario._id})
    // const favoritos = new FavModel({idUsuario: usuario._id})

    // usuario.idCarrito = carrito._id
    // usuario.idFavoritos = favoritos._id

    // await carrito.save()
    // await favoritos.save()
    await usuario.save()
    
    return 201
  } catch (error) {
    console.log(error)
  }
}

const inicioSesion = async (body) => {
  try {

    const usuarioExiste = await UsuarioModel.findOne({ nombreUsuario: body.nombreUsuario })

    if (!usuarioExiste) {
      return { code: 400 }
    }

    const verificacionContrasenia = bcrypt.compareSync(body.contrasenia, usuarioExiste.contrasenia)

    if (verificacionContrasenia) {

      const payload = {
        _id: usuarioExiste._id,
        rol: usuarioExiste.rol,
        bloqueado: usuarioExiste.bloqueado,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET)

      return {
        code: 200,
        token
      }
    } else {
      return { code: 400 }
    }



  } catch (error) {
    console.log(error)
  }
}

const obtenerTodosLosUsuarios = async () => {
  try {
    const usuarios = await UsuarioModel.find()
    return usuarios
  } catch (error) {
    console.log(error)
  }
}

const obtenerUnUsuario = async (idUsuario) => {
  try {
    const usuario = await UsuarioModel.findOne({ _id: idUsuario })
    return usuario
  } catch (error) {
    console.log(error)
  }
}

const bajaUsuarioFisica = async (idUsuario) => {

  await UsuarioModel.findByIdAndDelete({ _id: idUsuario })
  return 200
}

const habilitarUsuario = async(idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario)
  usuario.bloqueado = false
  await usuario.save()

  return {
    msg:'Usuario habilitado',
    statusCode: 200
    }
}

const deshabilitarUsuario = async(idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario)
  usuario.bloqueado = true
  await usuario.save()

  return {
    msg:'Usuario deshabilitado',
    statusCode: 200
    }
}

const fotoPerfil = async (idUsuario, file) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)
    const imagen = await cloudinary.uploader.upload(file.path)
    usuario.foto = imagen.url
    await usuario.save()

    return {
      msg: 'Foto perfil cargada',
      statusCode: 200
    }

  } catch (error) {
    return {
      msg: 'Error al cargar foto de perfil',
      statusCode: 500,
      error
    }
  }
}



module.exports = {
  nuevoUsuario,
  inicioSesion,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  bajaUsuarioFisica,
  habilitarUsuario,
  deshabilitarUsuario,
  fotoPerfil
}