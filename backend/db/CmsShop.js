// backend/db/CmsShop.js
const mysql = require('mysql2/promise');

// دریافت متغیرهای محیطی
const {
  DB_HOST = '127.0.0.1',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'cms_store'
} = process.env;

// ایجاد pool با SSL برای اتصال به Aiven
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,  // تغییر به DB_PASSWORD مطابق Vercel
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true // ضروری برای Aiven
  }
});

// تابع اصلی برای اجرای query
async function _query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// تابع query با callback یا promise
function query(sql, params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }

  if (typeof cb === 'function') {
    _query(sql, params)
      .then(rows => cb(null, rows))
      .catch(err => cb(err));
    return;
  } else {
    return _query(sql, params);
  }
}

module.exports = {
  pool,
  query
};
