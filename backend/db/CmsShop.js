// backend/db/CmsShop.js
const mysql = require('mysql2/promise');

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = 3306,
  DB_USER = 'root',
  DB_PASS = '',
  DB_NAME = 'cms_store'
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function _query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

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
