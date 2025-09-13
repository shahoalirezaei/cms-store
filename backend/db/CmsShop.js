// backend/db/CmsShop.js
const mysql = require("mysql2/promise");
const fs = require("fs");

// دریافت متغیرهای محیطی
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

// ایجاد pool با SSL فقط اگر ca.pem موجود باشه
const sslConfig = fs.existsSync(__dirname + "/ca.pem")
  ? { ca: fs.readFileSync(__dirname + "/ca.pem") }
  : null;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig
});

async function _query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

function query(sql, params, cb) {
  if (typeof params === "function") {
    cb = params;
    params = [];
  }

  if (typeof cb === "function") {
    _query(sql, params)
      .then(rows => cb(null, rows))
      .catch(err => cb(err));
    return;
  } else {
    return _query(sql, params);
  }
}

module.exports = { pool, query };
