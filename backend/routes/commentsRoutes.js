// routes/commentsRoutes.js
const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const commentsRouter = express.Router();

// GET همه میتونن ببینن، بدون auth
commentsRouter.get("/", (req, res) => {
  let selectAllCommentsQuery = `SELECT Comments.id, Comments.isAccept , Comments.body, Comments.date, Comments.hour, Users.firsname as userID, Products.title as productID FROM Comments INNER JOIN Users ON Users.id = Comments.userID INNER JOIN Products ON Products.id = Comments.productID`;

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

  let deleteCommentQuery = `DELETE FROM Comments WHERE id = ${commentID}`;
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
  let editCommentQuery = `UPDATE Comments SET body="${req.body.body}" WHERE id = ${commentID}`;

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
  let editCommentQuery = `UPDATE Comments SET isAccept = 1 WHERE id = ${commentID}`;

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
  let editCommentQuery = `UPDATE Comments SET isAccept = 0 WHERE id = ${commentID}`;

  CmsShopDB.query(editCommentQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

module.exports = commentsRouter;
