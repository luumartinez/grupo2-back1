const { Router } = require("express");
const {
  registrarUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  iniciarSesionUsuario,
  cambiarEstadoUsuario,
  agregarFotoPerfil,
  eliminarUnUsuario,
  editarUsuario,
} = require("../controllers/usuarios.controllers");
const router = Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");

router.post(
  "/",
  [
    check("nombreUsuario")
      .not()
      .isEmpty()
      .withMessage("El campo 'Usuario' no puede estar vacío.")
      .isLength({ min: 5, max: 40 })
      .withMessage("El 'Usuario' debe tener entre 5 y 40 caracteres."),

    check("contrasenia")
      .not()
      .isEmpty()
      .withMessage("El campo 'Contraseña' no puede estar vacío.")
      .isLength({ min: 8, max: 50 })
      .withMessage("La 'Contraseña' debe tener entre 8 y 50 caracteres."),

      check("nombre")
      .not()
      .isEmpty()
      .withMessage("El campo 'nombre' no puede estar vacío.")
      .isLength({ min:3, max: 25 })
      .withMessage("El 'Nombre' debe tener entre 3 y 25 caracteres."),  

      check("apellido")
      .not()
      .isEmpty()
      .withMessage("El campo 'Contraseña' no puede estar vacío.")
      .isLength({ min: 3, max: 25 })
      .withMessage("El 'Apellido' debe tener entre 3 y 25 caracteres."),

      check("email")
      .not()
      .isEmpty()
      .withMessage("El campo 'Contraseña' no puede estar vacío.")
      .isLength({ min: 10 })
      .withMessage("La 'Contraseña' debe tener como minimo 10 caracteres."),
  ],
  registrarUsuario
);

router.post(
  "/login",
  [
    check("nombreUsuario")
      .not()
      .isEmpty()
      .withMessage("El campo 'Usuario' no puede estar vacío."),

    check("contrasenia")
      .not()
      .isEmpty()
      .withMessage("El campo 'Contraseña' no puede estar vacío."),
  ],
  iniciarSesionUsuario
);

router.post(
  "/fotoPerfil/:idUsuario",
  multer.single("foto"),
  auth("admin"),
  agregarFotoPerfil
);

router.get("/", auth("admin"), obtenerTodosLosUsuarios);
router.get("/:idUsuario", auth("admin"), obtenerUnUsuario);

router.put("/:idUsuario/:accion", auth("admin"), cambiarEstadoUsuario);
router.put("/:idUsuario", auth("admin"), editarUsuario);
router.delete("/:idUsuario", auth("admin"), eliminarUnUsuario);

module.exports = router;
