const express = require("express");
const {
  obtenerUnVideojuegoPorIdOTodos,
  crearVideojuego,
  editarVideojuegoPorId,
  eliminarVideojuegoPorId,
  buscarVideojuegoPorTermino,
  habilitarDeshabilitarJuegoPorId,
  imagenVideojuego,
  sacarVideojuegoDelCarrito,
  videojuegoAlCarrito,
  verVideojuegoEnCarrito,
  enviarMensaje,
  verVideojuegosFavoritos,
  marcarVideojuegoFavorito,
  sacarVideojuegoDeFavoritos,
  mercadoPago,
  confirmarPago,
} = require("../controllers/videoJuegos.controller");
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");
const router = express.Router();

/* GET - Obtener */
router.get("/", obtenerUnVideojuegoPorIdOTodos);
router.get("/buscar", buscarVideojuegoPorTermino);
router.get("/carrito", auth("usuario"), verVideojuegoEnCarrito)
router.get("/favoritos", auth("usuario"), verVideojuegosFavoritos)
/* POST - Crear */
router.post(
  "/",
  [
    // Usar multer para cargar imagen si es necesario
    check("nombre", "campo NOMBRE vacío").not().isEmpty(),
    check("precio", "campo PRECIO vacío").not().isEmpty(),
    check("descripcion", "campo DESCRIPCION vacío").not().isEmpty(),
    check("plataformas", "campo PLATAFORMAS vacío").not().isEmpty(),
    check("genero", "campo GENERO vacío").not().isEmpty(),
    check("fechaLanzamiento", "campo FECHA DE LANZAMIENTO vacío")
      .not()
      .isEmpty(),
  ],
  auth("admin"),
  crearVideojuego
);

router.post(
  "/imagenJuego/:idVideojuego",
  multer.single("imagen"),
  auth("admin"),
  imagenVideojuego
);
router.post('/carrito/agregar/:idVideojuego', auth("usuario"), videojuegoAlCarrito)
router.post('/favoritos/agregar/:idVideojuego', auth("usuario"), marcarVideojuegoFavorito)

router.post("/enviarWhatsApp", enviarMensaje);

router.post('/pagarConMp', auth("usuario"), mercadoPago)

router.post("/confirmarPago", auth("usuario"), confirmarPago);

/* PUT - Editar */
router.put(
  "/:idVideojuego",
  multer.single("imagen"),
  [
    // Usar multer si se actualiza imagen
    check("nombre", "campo NOMBRE vacío").not().isEmpty(),
    check("precio", "campo PRECIO vacío").not().isEmpty(),
    check("descripcion", "campo DESCRIPCION vacío").not().isEmpty(),
    check("plataformas", "campo PLATAFORMAS vacío").not().isEmpty(),
    check("genero", "campo GENERO vacío").not().isEmpty(),
    check("fechaLanzamiento", "campo FECHA DE LANZAMIENTO vacío")
      .not()
      .isEmpty(),
  ],
  auth("admin"),
  editarVideojuegoPorId
);

router.put(
  "/habilitarDeshabilitar/:idVideojuego",
  auth("admin"),
  habilitarDeshabilitarJuegoPorId
);

/* DELETE - Borrar */
router.delete("/:idVideojuego", auth("admin"), eliminarVideojuegoPorId);
router.delete("/eliminarDelCarrito/:idVideojuego", auth("usuario"), sacarVideojuegoDelCarrito);
router.delete("/eliminarDeFavoritos/:idVideojuego", auth("usuario"), sacarVideojuegoDeFavoritos);



module.exports = router;
