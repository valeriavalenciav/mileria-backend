const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritos.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/:id/favoritos', authenticate, favoritosController.addFavorito);
router.get('/:id/favoritos', authenticate, favoritosController.getFavoritos);
router.delete('/:id/favoritos/:productoId', authenticate, favoritosController.deleteFavorito);

module.exports = router;
