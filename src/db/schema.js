const {
  sqliteTable,
  text,
  integer,
  blob,
  index,
} = require("drizzle-orm/sqlite-core");

module.exports.users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    hashed_password: blob("hashed_password").notNull(),
    salt: blob("salt").notNull(),
  },
  (users) => ({
    usernameIdx: index("username_idx").on(users.username),
  }),
);
