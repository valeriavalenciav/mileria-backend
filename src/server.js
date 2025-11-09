const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const favoritosRoutes = require('./routes/favoritos.routes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
connectDB();

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Usuarios con Autenticación',
    version: '2.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Registrar nuevo usuario',
        'POST /api/auth/login': 'Iniciar sesión',
        'GET /api/auth/profile': 'Obtener perfil (requiere token)'
      },
      users: {
        'GET /api/users': 'Listar usuarios (admin)',
        'GET /api/users/:id': 'Obtener usuario específico',
        'PUT /api/users/:id': 'Actualizar usuario',
        'DELETE /api/users/:id': 'Desactivar usuario'
      },
      favoritos: {
        'POST /api/users/:id/favoritos': 'Agregar producto favorito',
        'GET /api/users/:id/favoritos': 'Obtener productos favoritos',
        'DELETE /api/users/:id/favoritos/:productoId': 'Eliminar producto favorito'
      }
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', favoritosRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
