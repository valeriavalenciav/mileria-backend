const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Formato de correo inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true
  },
  productosFavoritos: [{
    nombre: String,
    precio: Number,
    categoria: String,
    agregadoEn: {
      type: Date,
      default: Date.now
    }
  }],
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaEliminacion: {
    type: Date
  },
  eliminacionProgramada: {
    type: Date
  }
}, {
  timestamps: true
});

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para generar JWT
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { id: this._id, correo: this.correo, rol: this.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = mongoose.model('User', userSchema);
