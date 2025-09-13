// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// DB wrapper (backend/db/CmsShop.js)
const CmsShopDB = require("./db/CmsShop");

// routers 
const productsRouter = require("./routes/productsRoutes");
const commentsRouter = require("./routes/commentsRoutes");
const usersRouter = require("./routes/usersRoutes");
const ordersRouter = require("./routes/ordersRoutes");
const offsRouter = require("./routes/offsRoutes");
const adminsRouter = require("./routes/adminsRoutes");
const monthlySalesRouter = require("./routes/monthlySalesRoutes");
const categoriesRouter = require("./routes/categoriesRouter");
const authRouter = require("./routes/auth");
const setupRouter = require("./routes/setupDemo");

const app = express();

// FRONTEND_URL دقیقا دامنه فرانت روی Vercel باشه
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: FRONTEND_URL,  // فقط اجازه به دامنه فرانت
  credentials: true      // مهم: اجازه ارسال هدر Authorization
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount routes
app.use("/api/products", productsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/offs", offsRouter);
app.use("/api/monthly-sales", monthlySalesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/setup", setupRouter);
app.use("/api/auth", authRouter);
app.use("/api/admins", adminsRouter);

// healthcheck
app.get("/", (req, res) => res.json({ ok: true, message: "Cms Shop API" }));


// test connection route
app.get("/api/test-db", async (req, res) => {
  try {
    const rows = await CmsShopDB.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Export the app so Vercel can run it as a serverless function
module.exports = app;
