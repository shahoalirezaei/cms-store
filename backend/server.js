require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const CmsShopDB = require("./db/CmsShop");

// Import routers
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

// اتصال به دیتابیس CmsShopDB
// const CmsShopDB = require("./db/CmsShopDB"); // همان فایلی که اتصال را ایجاد می‌کند

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// اگر بخواهی، می‌توانی این اتصال را در app ذخیره کنی:
app.set("db", CmsShopDB);

// مسیرهای API
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

app.listen(8001, () => console.log("Server running on port 8001"));
