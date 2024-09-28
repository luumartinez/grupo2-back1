const VideojuegoModel = require('../models/VideoJuegos.schema');

const obtenerTodosLosVideojuegos = async (limit, to) => {
  const [videojuegos, cantidadTotal] = await Promise.all([
    VideojuegoModel.find({ habilitado: true }).skip(to * limit).limit(limit),
    VideojuegoModel.countDocuments({ habilitado: true })
  ]);

  const paginacion = {
    videojuegos,
    cantidadTotal
  };

  return paginacion;
}

const obtenerUnVideojuego = async (id) => {
  const videojuego = await VideojuegoModel.findById({ _id: id });
  return videojuego;
}

const buscarVideojuego = async (termino) => {
  const reglaBusqueda = new RegExp(termino, 'i');
  const videojuegos = await VideojuegoModel.find({
    $or: [
      { nombre: reglaBusqueda },
      { descripcion: reglaBusqueda }
    ]
  });
  return videojuegos;
}

const nuevoVideojuego = (body) => {
  try {
    const newVideojuego = new VideojuegoModel(body);
    return newVideojuego;
  } catch (error) {
    console.log(error);
  }
}

const editarVideojuego = async (idVideojuego, body) => {
  try {
    const videojuegoEditado = await VideojuegoModel.findByIdAndUpdate({ _id: idVideojuego }, body, { new: true });
    return videojuegoEditado;
  } catch (error) {
    console.log(error);
  }
}

const eliminarVideojuego = async (idVideojuego) => {
  try {
    await VideojuegoModel.findByIdAndDelete({ _id: idVideojuego });
    return 200;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  obtenerTodosLosVideojuegos,
  obtenerUnVideojuego,
  nuevoVideojuego,
  editarVideojuego,
  eliminarVideojuego,
  buscarVideojuego
}
