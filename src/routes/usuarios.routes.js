const { Router } = require("express");
const {
  registrarUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  iniciarSesionUsuario,
  cambiarEstadoUsuario,
  agregarFotoPerfil,
  eliminarUnUsuario,
  cambiarDatosUsuario,
} = require("../controllers/usuarios.controllers");
const router = Router();
const { check } = require("express-validator");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");

router.post(
  "/",
  [
    check("nombreUsuario", "Campo USUARIO esta vacio").not().isEmpty(),
    check("nombreUsuario", "min:5 caracteres y max: 40 caracteres").isLength({
      min: 5,
      max: 40,
    }),
    check("contrasenia", "Campo CONTRASEÑA esta vacio").not().isEmpty(),
    check("contrasenia", "min: 8 caracteres y max: 50 caracteres").isLength({
      min: 8,
      max: 50,
    }),
    /*   check('nombreUsuario', 'Formato incorrecto: Tiene que ser un email').isEmail() */
  ],
  registrarUsuario
);
router.post(
  "/login",
  [
    check("nombreUsuario", "Campo USUARIO esta vacio").not().isEmpty(),
    check("contrasenia", "Campo CONTRASEÑA esta vacio").not().isEmpty(),
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
router.get(
  "/:idUsuario",
  [
    /*   check('_id', 'Formato ID incorrecto').isMongoId() */
  ],
  auth("admin"),
  obtenerUnUsuario
);
router.delete("/:idUsuario", auth("admin"), eliminarUnUsuario);
router.put("/:idUsuario/:accion", auth("admin"), cambiarEstadoUsuario);
router.put('/:idUsuario', auth("admin"), cambiarDatosUsuario);

module.exports = router;
