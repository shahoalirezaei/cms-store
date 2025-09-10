const mysql = require("mysql");
const util = require("util");

const CmsShopDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cms_store",
});

// تبدیل متد query به Promise-based
CmsShopDB.query = util.promisify(CmsShopDB.query);

module.exports = CmsShopDB;



// const mysql = require("mysql");

// const CmsShopDB = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "cms_store",
// });

// module.exports = CmsShopDB;
