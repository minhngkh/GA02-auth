const express = require("express");
const router = express.Router();

router.get("/login", (req, res, _) => {
  res.send("login page");
});

router.get("/register", (req, res, _) => {
  res.send("register page");
});

router.get("/logout", (req, res, _) => {
  res.send("logout page");
});

module.exports = router;
