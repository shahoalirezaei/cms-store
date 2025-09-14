// routes/offsRoutes.js
const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const offsRouter = express.Router();

// GET all offs (بدون نیاز به احراز هویت)
offsRouter.get('/', (req, res) => {
    let selectAllOffsQuery = `
      SELECT offs.id, offs.code, offs.date, offs.isActive, offs.percent, admins.firstname as adminID, products.title as productID 
      FROM offs 
      INNER JOIN admins ON admins.id = offs.adminID 
      INNER JOIN products ON products.id = offs.productID
    `;

    CmsShopDB.query(selectAllOffsQuery, (err, result) => {
        if (err) {
            res.send(null);
        } else {
            res.send(result);
        }
    });
});

// DELETE off (فقط ادمین)
offsRouter.delete('/:offID', authenticate, authorizeRole(['admin']), (req, res) => {
    let offID = req.params.offID;
    let deleteOffQuery = `DELETE FROM offs WHERE id = ?`;

    CmsShopDB.query(deleteOffQuery, [offID], (err, result) => {
        if (err) {
            res.send(null);
        } else {
            res.send(result);
        }
    });
});

// PUT فعال/غیرفعال کردن آف (فقط ادمین)
offsRouter.put('/active-off/:offID/:isActive', authenticate, authorizeRole(['admin']), (req, res) => {
    let offID = req.params.offID;
    let isActive = req.params.isActive;
    let activeOffQuery = `UPDATE offs SET isActive=? WHERE id = ?`;

    CmsShopDB.query(activeOffQuery, [isActive, offID], (err, result) => {
        if (err) {
            res.send(null);
        } else {
            res.send(result);
        }
    });
});

// POST ایجاد آف جدید (فقط ادمین)
offsRouter.post('/', authenticate, authorizeRole(['admin']), (req, res) => {
    const { code, date, isActive, percent, productID } = req.body;
    const adminID = req.user.id;  // ادمین سازنده از توکن گرفته می‌شود

    const insertOffQuery = `
      INSERT INTO Offs (code, date, isActive, percent, adminID, productID)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    CmsShopDB.query(
        insertOffQuery,
        [code, date, isActive, percent, adminID, productID],
        (err, result) => {
            if (err) {
                console.error("Error inserting new off:", err);
                return res.status(500).json({ error: "Database insert error" });
            }
            res.status(201).json({ message: "Off created successfully", insertId: result.insertId });
        }
    );
});

module.exports = offsRouter;