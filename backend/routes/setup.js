const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const router = express.Router();

// ⚠️ ONE-TIME ADMIN CREATION
router.post('/create-admin', async (req, res) => {
  try {
    // 🔐 simple protection
    if (req.query.key !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const username = 'admin';
    const email = 'admin@taskmanager.com';
    const password = 'admin123';

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO users (username, email, password, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE role='admin'`,
      [username, email, hashedPassword]
    );

    res.json({ message: '✅ Admin user created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Admin creation failed' });
  }
});

module.exports = router;
