const express = require("express");
const router = express.Router();

router.get("/login", (req, res, _) => {
  res.render("auth/login", {
    title: "Login",
    buttons: [{ name: "Register", route: "/auth/register" }],
  });
});

router.get("/register", (req, res, _) => {
  res.render("auth/register", {
    title: "Register",
    buttons: [{ name: "Login", route: "/auth/login" }],
  });
});

router.get("/logout", (req, res, _) => {
  res.send("logout page");
});

module.exports = router;
