const passport = require("passport");
const LocalStrategy = require("passport-local");

const crypto = require("crypto");
const db = require("../db/client");
const { users } = require("../db/schema");
const { eq } = require("drizzle-orm");

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const query = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .catch((err) => {
        return cb(err);
      });

    if (!query.length) {
      return cb(null, false, { message: "Incorrect username or password." });
    }

    const user = query[0];

    crypto.pbkdf2(
      password,
      user.salt,
      310000,
      32,
      "sha256",
      (err, hashedPassword) => {
        if (err) {
          return cb(err);
        }
        if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        return cb(null, user);
      },
    );
  }),
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});

module.exports = passport;
