const express = require("express");
const router = express.Router();
const db = require("../../db/client");
const { users } = require("../../db/schema");

router.get("/getAllUsers", async (req, res) => {
  const response = await db.select().from(users);
  res.status(200).json(response);
});

router.get("/crash", (_, __) => {
  throw new Error("Crash!");
});

module.exports = router;
