const express = require('express');
const adminsRouter = express.Router();
const Admin = require('../models/Admin');  // مدل MySQL
const bcrypt = require('bcrypt');
const CmsShopDB = require('../db/CmsShop');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

// فقط ادمین‌ها اجازه دارند لیست ادمین‌ها را ببینند
adminsRouter.get("/", authenticate, authorizeRole(['admin']), (req, res) => {
  const selectAllAdminsQuery = 'SELECT id, username, role FROM admins';
  CmsShopDB.query(selectAllAdminsQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(result);
  });
});

// ایجاد دمو و ادمین (این عملیات بهتر است فقط توسط ادمین انجام شود)
adminsRouter.post('/create-demo', authenticate, authorizeRole(['admin']), async (req, res) => {
  try {
    const demoUser = await Admin.findOneByUsername('demo');
    const adminUser = await Admin.findOneByUsername('admin');

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await Admin.createAdmin({
        username: 'demo',
        password: hashedPassword,
        role: 'demo',
      });
    }

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.createAdmin({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
    }

    res.json({ message: 'Demo and admin users created (if they did not exist before)' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating users', error: err.message });
  }
});

module.exports = adminsRouter;
