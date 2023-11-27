const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const { users } = require("../../db/schema");

router.get("/getAllUsers", async (req, res) => {
  const response = await db.select().from(users);
  res.status(200).json(response);
});

router.post("/createUser", async (req, res) => {
  res.send("ok");
});

module.exports = router;
