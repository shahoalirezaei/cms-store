// routes/ordersRoutes.js
const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const ordersRouter = express.Router();

// GET all orders (بدون نیاز به احراز هویت)
ordersRouter.get("/", (req, res) => {
  const selectAllOrdersQuery = `
    SELECT 
      Orders.id, Orders.date, Orders.hour, Orders.price, Orders.off, Orders.sale, 
      Orders.popularity, Orders.count, Orders.sale_count, Orders.isActive, 
      Users.firsname as userID, Products.title as productID 
    FROM Orders 
    INNER JOIN Users ON Users.id = Orders.userID 
    INNER JOIN Products ON Products.id = Orders.productID
  `;

  CmsShopDB.query(selectAllOrdersQuery, (err, result) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json(null);
    }
    res.status(200).json(result);
  });
});

// DELETE order (فقط ادمین)
ordersRouter.delete("/:orderID", authenticate, authorizeRole(['admin']), (req, res) => {
  const orderID = req.params.orderID;
  const deleteOrderQuery = `DELETE FROM Orders WHERE id = ?`;

  CmsShopDB.query(deleteOrderQuery, [orderID], (err, result) => {
    if (err) {
      console.error("Error deleting order:", err);
      return res.status(500).json(null);
    }
    res.status(200).json(result);
  });
});

// PUT فعال/غیرفعال کردن سفارش (فقط ادمین)
ordersRouter.put("/active-order/:orderID/:isActive", authenticate, authorizeRole(['admin']), (req, res) => {
  console.log("Incoming request to update isActive:");
// console.log("orderID:", req.params.orderID);
// console.log("isActive (raw):", req.params.isActive);

  const orderID = parseInt(req.params.orderID, 10);
  const isActive = parseInt(req.params.isActive, 10);  // ✅ convert to integer
  // console.log("Parsed values →", { orderID, isActive });
  

  const activeOrderQuery = `UPDATE Orders SET isActive = ? WHERE id = ?`;

  CmsShopDB.query(activeOrderQuery, [isActive, orderID], (err, result) => {
    if (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Order updated successfully", result });
  });
});


module.exports = ordersRouter;
