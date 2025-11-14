const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { nombre: new RegExp(search, 'i') },
          { correo: new RegExp(search, 'i') }
        ]
      };
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    if (req.user.rol !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para ver este usuario'
      });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.rol !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para actualizar este usuario'
      });
    }
    
    const { nombre, direccion, password } = req.body;
    const updateData = {};
    
    if (nombre) updateData.nombre = nombre;
    if (direccion) updateData.direccion = direccion;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para eliminar este usuario'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        activo: false,
        fechaEliminacion: new Date(),
        eliminacionProgramada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario desactivado. Será eliminado permanentemente en 30 días.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        activo: false,
        fechaEliminacion: new Date(),
        eliminacionProgramada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Tu cuenta ha sido desactivada y será eliminada permanentemente en 30 días. Puedes reactivarla iniciando sesión nuevamente dentro de este período.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};
