const User = require('../models/User.model');

exports.register = async (req, res, next) => {
  try {
    const { nombre, correo, password, direccion } = req.body;
    
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El correo ya está registrado'
      });
    }
    
    const user = new User({ nombre, correo, password, direccion });
    await user.save();
    
    const token = user.generateToken();
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          correo: user.correo,
          direccion: user.direccion,
          rol: user.rol
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;
    
    const user = await User.findOne({ correo });
    
    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    const token = user.generateToken();
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          correo: user.correo,
          direccion: user.direccion,
          rol: user.rol
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};
