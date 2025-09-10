const bcrypt = require("bcrypt");

const plainPassword = "932523023"; // رمزی که می‌خوای استفاده کنی

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log("Hashed password:", hash);
});
