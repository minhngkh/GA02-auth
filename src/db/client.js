const { createClient } = require("@libsql/client");
const { drizzle } = require("drizzle-orm/libsql");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

module.exports = drizzle(client);
