const User = require('../models/User.model');

exports.addFavorito = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }
    
    const { nombre, precio, categoria } = req.body;
    
    if (!nombre) {
      return res.status(400).json({
        success: false,
        error: 'El nombre del producto es obligatorio'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    const exists = user.productosFavoritos.some(p => p.nombre === nombre);
    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'El producto ya está en favoritos'
      });
    }
    
    user.productosFavoritos.push({
      nombre,
      precio: precio || 0,
      categoria: categoria || 'General'
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Producto agregado a favoritos',
      data: user.productosFavoritos
    });
  } catch (error) {
    next(error);
  }
};

exports.getFavoritos = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }
    
    const user = await User.findById(req.params.id).select('productosFavoritos');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user.productosFavoritos
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFavorito = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No autorizado'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    user.productosFavoritos = user.productosFavoritos.filter(
      p => p._id.toString() !== req.params.productoId
    );
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Producto eliminado de favoritos',
      data: user.productosFavoritos
    });
  } catch (error) {
    next(error);
  }
};
