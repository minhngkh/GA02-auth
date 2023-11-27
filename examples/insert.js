const crypto = require("crypto");
const db = require("../src/db/client");
const { users } = require("../src/db/schema");

const username = "test";
const password = "pass123";

const salt = crypto.randomBytes(16);

crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
  if (err) {
    throw err;
  }

  db.insert(users)
    .values({
      // hashed_password: hashedPassword,
      // salt: salt,
      username: username,
      password: password,
      email: username + "@gmail.com",
      hashed_password: hashedPassword,
      salt: salt,
    })
    .catch((err) => {
      throw err;
    })
    .then(() => {
      console.log("success");
    });
});
