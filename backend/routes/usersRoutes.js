const express = require("express");
const CmsShopDB = require("./../db/CmsShop");
const { authenticate, authorizeRole } = require("../middlewares/authMiddleware");

const usersRouter = express.Router();

// GET همه کاربران بدون احراز هویت
usersRouter.get("/", (req, res) => {
  let selectAllUsersQuery = `SELECT * FROM Users`;

  CmsShopDB.query(selectAllUsersQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

// DELETE فقط ادمین‌ها اجازه دارند
usersRouter.delete("/:userID", authenticate, authorizeRole(["admin"]), (req, res) => {
  let userID = req.params.userID;

  let deleteUserQuery = `DELETE FROM Users WHERE id = ${userID}`;

  CmsShopDB.query(deleteUserQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

// PUT فقط ادمین‌ها اجازه دارند
usersRouter.put("/:userID", authenticate, authorizeRole(["admin"]), (req, res) => {
  let userID = req.params.userID;
  let body = req.body;

  let editUserQuery = `UPDATE Users SET firsname="${body.firsname}", lastname="${body.lastname}", username="${body.username}", password="${body.password}", phone=${body.phone}, city="${body.city}", email="${body.email}", address="${body.address}" ,score=${body.score}, buy=${body.buy}, img="${body.img}" WHERE id = ${userID}`;

  CmsShopDB.query(editUserQuery, (err, result) => {
    if (err) {
      res.send(null);
    } else {
      res.send(result);
    }
  });
});

module.exports = usersRouter;
