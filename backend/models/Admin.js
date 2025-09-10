const CmsShopDB = require("../db/CmsShop");

const Admin = {
  findOneByUsername: async (username) => {
    const results = await CmsShopDB.query("SELECT * FROM admins WHERE username = ?", [username]);
    return results.length > 0 ? results[0] : null;
  },

  createAdmin: async ({ username, password, role }) => {
    const result = await CmsShopDB.query(
      "INSERT INTO admins (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );
    return result;
  },
};

module.exports = Admin;
