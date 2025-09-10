const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const categoriesRouter = express.Router();

// GET all categories - open for all (public)
categoriesRouter.get("/", (req, res) => {
  const selectAllCategoriesQuery = `SELECT * FROM Categories`;

  CmsShopDB.query(selectAllCategoriesQuery, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Database error while fetching categories" });
    }
    res.status(200).json(result);
  });
});

// POST add new category - only admin
categoriesRouter.post("/", authenticate, authorizeRole(["admin"]), (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const insertQuery = `INSERT INTO Categories (name, description) VALUES (?, ?)`;
  CmsShopDB.query(insertQuery, [name, description], (err, result) => {
    if (err) {
      console.error("Error adding category:", err);
      return res.status(500).json({ error: "Database error while adding category" });
    }
    res.status(201).json({ message: "Category added successfully", insertId: result.insertId });
  });
});

// PUT update category by id - only admin
categoriesRouter.put("/:categoryID", authenticate, authorizeRole(["admin"]), (req, res) => {
  const categoryID = req.params.categoryID;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const updateQuery = `UPDATE Categories SET name = ?, description = ? WHERE id = ?`;
  CmsShopDB.query(updateQuery, [name, description, categoryID], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ error: "Database error while updating category" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated successfully" });
  });
});

// DELETE category by id - only admin
categoriesRouter.delete("/:categoryID", authenticate, authorizeRole(["admin"]), (req, res) => {
  const categoryID = req.params.categoryID;

  const deleteQuery = `DELETE FROM Categories WHERE id = ?`;
  CmsShopDB.query(deleteQuery, [categoryID], (err, result) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ error: "Database error while deleting category" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  });
});

module.exports = categoriesRouter;
