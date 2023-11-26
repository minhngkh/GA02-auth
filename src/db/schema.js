const {
  sqliteTable,
  text,
  integer,
  index,
} = require("drizzle-orm/sqlite-core");

module.exports.users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    hashed_password: text("hashed_password").notNull(),
    salt: text("salt").notNull(),
  },
  (users) => ({
    usernameIdx: index("username_idx").on(users.username),
  }),
);
