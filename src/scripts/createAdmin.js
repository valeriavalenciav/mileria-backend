
require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User.model');

const createAdmin = async () => {
  try {
    // 1. Conectar a la base de datos
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("La variable MONGO_URI no está definida en tu archivo .env.");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB conectado exitosamente.");

    // 2. Verificar si ya existe un administrador
    const adminExists = await User.findOne({ rol: 'admin' });
    if (adminExists) {
      console.log("Ya existe una cuenta de administrador.");
      return;
    }

    // 3. Obtener credenciales del administrador desde las variables de entorno
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminNombre = process.env.ADMIN_NOMBRE || 'Admin';
    const adminDireccion = process.env.ADMIN_DIRECCION;

    if (!adminEmail || !adminPassword || !adminDireccion) {
      throw new Error("Por favor, define ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_DIRECCION en tu archivo .env.");
    }

    // 4. Crear el nuevo usuario administrador
    const adminUser = new User({
      nombre: adminNombre,
      correo: adminEmail,
      password: adminPassword,
      rol: 'admin',
      activo: true,
      direccion: adminDireccion
    });

    await adminUser.save();
    console.log("¡Usuario administrador creado exitosamente!");
    console.log(`Email: ${adminEmail}`);

  } catch (error) {
    console.error("Error al crear el usuario administrador:", error.message);
  } finally {
    // 5. Desconectar de la base de datos
    await mongoose.disconnect();
    console.log("MongoDB desconectado.");
  }
};

createAdmin();
