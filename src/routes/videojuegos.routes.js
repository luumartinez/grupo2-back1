const express = require('express');
const { obtenerUnVideojuegoPorIdOTodos, crearVideojuego, editarVideojuegoPorId, eliminarVideojuegoPorId, buscarVideojuegoPorTermino } = require('../controllers/videoJuegos.controller');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer');
const router = express.Router();

/* GET - Obtener */
router.get('/', obtenerUnVideojuegoPorIdOTodos);
router.get('/buscar', buscarVideojuegoPorTermino);

/* POST - Crear */
router.post('/', multer.single('imagen'), [  // Usar multer para cargar imagen si es necesario
    check('nombre', 'campo NOMBRE vacío').not().isEmpty(),
    check('precio', 'campo PRECIO vacío').not().isEmpty(),
    check('descripcion', 'campo DESCRIPCION vacío').not().isEmpty(),
    check('plataformas', 'campo PLATAFORMAS vacío').not().isEmpty(),
    check('genero', 'campo GENERO vacío').not().isEmpty(),
    check('fechaLanzamiento', 'campo FECHA DE LANZAMIENTO vacío').not().isEmpty(),
], auth('admin'), crearVideojuego);

/* PUT - Editar */
router.put('/:idVideojuego', multer.single('imagen'), [  // Usar multer si se actualiza imagen
    check('nombre', 'campo NOMBRE vacío').not().isEmpty(),
    check('precio', 'campo PRECIO vacío').not().isEmpty(),
    check('descripcion', 'campo DESCRIPCION vacío').not().isEmpty(),
    check('plataformas', 'campo PLATAFORMAS vacío').not().isEmpty(),
    check('genero', 'campo GENERO vacío').not().isEmpty(),
    check('fechaLanzamiento', 'campo FECHA DE LANZAMIENTO vacío').not().isEmpty(),
], auth('admin'), editarVideojuegoPorId);

/* DELETE - Borrar */
router.delete('/:idVideojuego', auth('admin'), eliminarVideojuegoPorId);

module.exports = router;
