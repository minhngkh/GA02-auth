const db = require("../../db/client");
const { users } = require("../../db/schema");

exports.createUser = (username, email, hashed_password, salt) => {
  return db
    .insert(users)
    .values({
      username: username,
      email: email,
      hashed_password: hashed_password,
      salt: salt,
    })
    .returning({
      insertedId: users.id,
    });
};
