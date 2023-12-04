const express = require("express");
const router = express.Router();
const db = require("../../db/client");
const { users } = require("../../db/schema");

router.get("/", (req, res, _) => {
  res.render("main/_index", { layout: "main/_layout"})
});

router.get("/productList", (req, res, _) => {
  res.render("main/_productList", { layout: "main/_layout"})
});

router.get("/cart", (req, res, _) => {
  res.render("main/_cart", { layout: "main/_layout"})
});

router.get("/product", (req, res, _) => {
  res.render("main/_product", { layout: "main/_layout"})
});

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

router.get("/alert", (req, res, _) => {
  res.render("alert");
});

module.exports = router;
