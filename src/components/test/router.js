const express = require("express");
const router = express.Router();
const db = require("../../db/client");
const { users } = require("../../db/schema");

router.get("/getAllUsers", async (req, res) => {
  const response = await db.select().from(users);
  res.status(200).json(response);
});

router.post("/createUser", async (req, res) => {
  res.send("ok");
});

router.get("/crash", (_, __) => {
  throw new Error("Crash!");
});

router.get("/login1", (req, res, _) => {
  res.send("Success")
})

router.get("/login2", (req, res, _) => {
  res.send("Failure")
})

module.exports = router;
