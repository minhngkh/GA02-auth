const crypto = require("crypto");
const db = require("../src/db/client");
const { users } = require("../src/db/schema");
const { eq } = require("drizzle-orm");

const username = "test3";

async function getUser() {
  const query = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const user = query[0];
  crypto.pbkdf2(
    "123456",
    user.salt,
    310000,
    32,
    "sha256",
    (err, hashedPassword) => {
      if (err) {
        throw err;
      }
      if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        console.log("incorrect");
      }
      console.log("correct");
    },
  );
}

getUser();
