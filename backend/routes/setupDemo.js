// routes/setupDemo.js
const express = require('express');
const bcrypt  = require('bcrypt');
const Admin   = require('../models/Admin');
const router  = express.Router();

router.post('/create-demo', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  if (!await Admin.findOne({ username:'demo' })) {
    await Admin.create({
      username: 'demo',
      password: await bcrypt.hash('demo123', salt),
      role: 'demo'
    });
  }
  if (!await Admin.findOne({ username:'admin' })) {
    await Admin.create({
      username: 'admin',
      password: await bcrypt.hash('admin123', salt),
      role: 'admin'
    });
  }
  res.json({ message: 'Users created' });
});

module.exports = router;
