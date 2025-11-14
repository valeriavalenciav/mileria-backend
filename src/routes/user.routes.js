const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.patch('/:id/role', authenticate, isAdmin, userController.updateUserRole);
router.delete('/delete/me', authenticate, userController.deleteMe);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);


module.exports = router;
