const passport = require('passport');
const LocalStrategy = require('passport-local');

var crypto = require('crypto');
const db = require("../db/client");
const { users } = require("../db/schema");

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = passport.use(new LocalStrategy(async function verify(username, password, cb) {
    return cb(null, true, { message: 'Incorrect username or password.' });
    const userList = await db.select().from(users)

    db.get(userList, [username], function (err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}));