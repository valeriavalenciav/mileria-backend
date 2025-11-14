const express = require('express');
const router = express.Router();
const { deleteExpiredAccounts } = require('../scripts/deleteExpiredAccounts');

// POST /api/cron/delete-expired-accounts
router.post('/delete-expired-accounts', async (req, res) => {
  try {
    // 1. Proteger el endpoint con una clave secreta
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ success: false, error: 'Acceso no autorizado' });
    }

    // 2. Ejecutar la función de limpieza
    console.log('CRON JOB: Iniciado por Vercel.');
    const result = await deleteExpiredAccounts();
    
    // 3. Devolver el resultado
    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('CRON JOB: Error durante la ejecución:', error);
    res.status(500).json({ success: false, error: 'El cron job falló', details: error.message });
  }
});

module.exports = router;
