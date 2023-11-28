const crypto = require("crypto");
const db = require("../src/db/client");
const { users } = require("../src/db/schema");

const username = "test5";
const password = "pass123";

const salt = crypto.randomBytes(16);

crypto.pbkdf2(
  password,
  salt,
  310000,
  32,
  "sha256",
  async (err, hashedPassword) => {
    if (err) {
      throw err;
    }

    const result = await db
      .insert(users)
      .values({
        // hashed_password: hashedPassword,
        // salt: salt,
        username: username,
        password: password,
        email: username + "@gmail.com",
        hashed_password: hashedPassword,
        salt: salt,
      })
      .returning({
        insertedId: users.id,
      })
      .catch((err) => {
        throw err;
      });

    console.log(result);
  },
);
