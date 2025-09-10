const express = require('express');
const monthlyRouter = express.Router();


const CmsShopDB = require('../db/CmsShop');

monthlyRouter.get('/', (req, res) => {
  const sql = 'SELECT month, total_sales FROM monthly_sales ORDER BY id';
  CmsShopDB.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching monthly sales:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

module.exports = monthlyRouter;
