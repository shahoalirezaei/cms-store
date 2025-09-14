const express = require("express");
const CmsShopDB = require("../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const commentsRouter = express.Router();

// ---------------------- GET all comments (public) ----------------------
commentsRouter.get("/", (req, res) => {
  const query = `
    SELECT Comments.id, Comments.isAccept, Comments.body, Comments.date, Comments.hour,
           Users.firstname AS userID, Products.title AS productID
    FROM Comments
    INNER JOIN Users ON Users.id = Comments.userID
    INNER JOIN Products ON Products.id = Comments.productID
  `;

  CmsShopDB.query(query, (err, result) => {
    if (err) {
      console.error("DB error in GET /comments:", err.message);
      return res.status(500).json({ success: false, error: err.message, data: [] });
    }
    res.json({ success: true, data: result });
  });
});

// ---------------------- DELETE comment (admin only) ----------------------
commentsRouter.delete(
  "/:commentID",
  authenticate,
  authorizeRole(["admin"]),
  (req, res) => {
    const commentID = req.params.commentID;
    const query = "DELETE FROM Comments WHERE id = ?";

    CmsShopDB.query(query, [commentID], (err, result) => {
      if (err) {
        console.error("DB error in DELETE /comments:", err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: result });
    });
  }
);

// ---------------------- UPDATE comment (admin only) ----------------------
commentsRouter.put(
  "/:commentID",
  authenticate,
  authorizeRole(["admin"]),
  (req, res) => {
    const commentID = req.params.commentID;
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: "Comment body cannot be empty" });
    }

    const query = "UPDATE Comments SET body = ? WHERE id = ?";
    CmsShopDB.query(query, [body, commentID], (err, result) => {
      if (err) {
        console.error("DB error in PUT /comments:", err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: result });
    });
  }
);

// ---------------------- ACCEPT comment (admin only) ----------------------
commentsRouter.post(
  "/accept/:commentID",
  authenticate,
  authorizeRole(["admin"]),
  (req, res) => {
    const commentID = req.params.commentID;
    const query = "UPDATE Comments SET isAccept = 1 WHERE id = ?";

    CmsShopDB.query(query, [commentID], (err, result) => {
      if (err) {
        console.error("DB error in POST /comments/accept:", err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: result });
    });
  }
);

// ---------------------- REJECT comment (admin only) ----------------------
commentsRouter.post(
  "/reject/:commentID",
  authenticate,
  authorizeRole(["admin"]),
  (req, res) => {
    const commentID = req.params.commentID;
    const query = "UPDATE Comments SET isAccept = 0 WHERE id = ?";

    CmsShopDB.query(query, [commentID], (err, result) => {
      if (err) {
        console.error("DB error in POST /comments/reject:", err.message);
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: result });
    });
  }
);

module.exports = commentsRouter;
