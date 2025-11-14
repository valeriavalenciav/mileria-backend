const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User.model');

const deleteExpiredAccounts = async () => {
  console.log('Iniciando la búsqueda de cuentas expiradas para eliminar...');
  try {
    const now = new Date();
    const result = await User.deleteMany({
      activo: false,
      eliminacionProgramada: { $lte: now }
    });

    if (result.deletedCount > 0) {
      console.log(`Tarea finalizada: Se eliminaron ${result.deletedCount} cuentas expiradas.`);
    } else {
      console.log('Tarea finalizada: No se encontraron cuentas expiradas para eliminar.');
    }
  } catch (error) {
    console.error('Error durante la eliminación de cuentas expiradas:', error);
  }
};

// Esta parte permite que el script se ejecute de forma independiente
if (require.main === module) {
  // Cargar variables de entorno desde el root del proyecto
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });

  if (!process.env.MONGO_URI) {
    console.error('Error: La variable MONGO_URI no está definida en el archivo .env');
    process.exit(1);
  }

  (async () => {
    try {
      console.log('Conectando a MongoDB para la limpieza...');
      await mongoose.connect(process.env.MONGO_URI);
      await deleteExpiredAccounts();
    } catch (error) {
      console.error("Error en la conexión con la base de datos:", error);
    } finally {
      await mongoose.disconnect();
      console.log('Desconexión de MongoDB.');
      process.exit(0);
    }
  })();
}

module.exports = { deleteExpiredAccounts };
