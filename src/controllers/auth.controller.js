const User = require('../models/User.model');

exports.register = async (req, res, next) => {
  try {
    const { nombre, correo, password, direccion } = req.body;
    
    const existingUser = await User.findOne({ correo });

    if (existingUser && !existingUser.activo) {
      if (existingUser.eliminacionProgramada > new Date()) {
        // Reactivar cuenta
        existingUser.nombre = nombre;
        existingUser.password = password;
        existingUser.direccion = direccion;
        existingUser.activo = true;
        existingUser.fechaEliminacion = null;
        existingUser.eliminacionProgramada = null;

        await existingUser.save();
        const token = existingUser.generateToken();

        return res.status(200).json({
          success: true,
          message: '¡Bienvenido de vuelta! Tu cuenta ha sido reactivada.',
          data: {
            user: {
              id: existingUser._id,
              nombre: existingUser.nombre,
              correo: existingUser.correo,
              direccion: existingUser.direccion,
              rol: existingUser.rol
            },
            token
          }
        });
      } else {
        // El período de gracia ha expirado, el usuario debe ser eliminado permanentemente
        // Aquí se podría llamar a una función para eliminarlo de inmediato, 
        // o simplemente mostrar un mensaje y esperar al cron job.
        return res.status(400).json({
          success: false,
          error: 'Esta cuenta fue eliminada y ya no puede ser reactivada.'
        });
      }
    }

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
