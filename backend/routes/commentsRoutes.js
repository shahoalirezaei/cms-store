// routes/commentsRoutes.js
const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const commentsRouter = express.Router();

// GET همه میتونن ببینن، بدون auth
commentsRouter.get("/", (req, res) => {
  let selectAllCommentsQuery = `SELECT comments.id, comments.isAccept, comments.body, comments.date, comments.hour, users.firsname as userID, products.title as productID FROM comments INNER JOIN users ON users.id = comments.userID INNER JOIN products ON products.id = comments.productID`;

  CmsShopDB.query(selectAllCommentsQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

// فقط ادمین اجازه داره حذف کنه
commentsRouter.delete("/:commentID", authenticate, authorizeRole(["admin"]), (req, res) => {
  let commentID = req.params.commentID;

  let deleteCommentQuery = `DELETE FROM comments WHERE id = ${commentID}`;
  CmsShopDB.query(deleteCommentQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

// فقط ادمین اجازه داره ویرایش کنه
commentsRouter.put("/:commentID", authenticate, authorizeRole(["admin"]), (req, res) => {
  let commentID = req.params.commentID;
  let editCommentQuery = `UPDATE comments SET body="${req.body.body}" WHERE id = ${commentID}`;

  CmsShopDB.query(editCommentQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

// فقط ادمین اجازه داره تایید کنه
commentsRouter.post("/accept/:commentID", authenticate, authorizeRole(["admin"]), (req, res) => {
  let commentID = req.params.commentID;
  let editCommentQuery = `UPDATE comments SET isAccept = 1 WHERE id = ${commentID}`;

  CmsShopDB.query(editCommentQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

// فقط ادمین اجازه داره رد کنه
commentsRouter.post("/reject/:commentID", authenticate, authorizeRole(["admin"]), (req, res) => {
  let commentID = req.params.commentID;
  let editCommentQuery = `UPDATE comments SET isAccept = 0 WHERE id = ${commentID}`;

  CmsShopDB.query(editCommentQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

module.exports = commentsRouter;