const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const productsRouter = express.Router();

// GET همه محصولات بدون نیاز به احراز هویت
productsRouter.get("/", (req, res) => {
  const selectAllProductsQuery = `SELECT * FROM Products`;
  CmsShopDB.query(selectAllProductsQuery, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching products" });
    }
    res.json(result);
  });
});

// POST اضافه کردن محصول جدید - فقط ادمین
productsRouter.post("/", authenticate, authorizeRole(["admin"]), (req, res) => {
  const {
    title,
    price,
    count,
    img,
    popularity,
    sale,
    colors,
    url,
    productDesc,
    categoryID,
  } = req.body;

  const insertQuery = `
    INSERT INTO Products
      (title, price, count, img, popularity, sale, colors, url, productDesc, categoryID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    title,
    price,
    count,
    img,
    popularity,
    sale,
    colors,
    url,
    productDesc,
    categoryID,
  ];

  CmsShopDB.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("Add product error:", err);
      return res.status(500).json({ message: "Error adding product" });
    }
    res.status(201).json({ insertId: result.insertId, message: "Product added successfully" });
  });
});

// PUT ویرایش محصول - فقط ادمین
productsRouter.put("/:productID", authenticate, authorizeRole(["admin"]), (req, res) => {
  const productID = req.params.productID;
  const {
    title,
    price,
    count,
    img,
    popularity,
    sale,
    colors,
  } = req.body;

  const updateProductQuery = `
    UPDATE Products SET 
      title = ?, 
      price = ?, 
      count = ?, 
      img = ?, 
      popularity = ?, 
      sale = ?, 
      colors = ? 
    WHERE id = ?
  `;
  const values = [title, price, count, img, popularity, sale, colors, productID];

  CmsShopDB.query(updateProductQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating product" });
    }
    res.json({ message: "Product updated successfully" });
  });
});

// DELETE حذف محصول - فقط ادمین
productsRouter.delete("/:productID", authenticate, authorizeRole(["admin"]), (req, res) => {
  const productID = req.params.productID;
  const deleteProductQuery = `DELETE FROM Products WHERE id = ?`;

  CmsShopDB.query(deleteProductQuery, [productID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting product" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

module.exports = productsRouter;
