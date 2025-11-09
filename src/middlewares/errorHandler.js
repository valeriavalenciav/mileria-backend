const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'ID inválido'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'El correo ya está registrado'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
};

module.exports = errorHandler;
