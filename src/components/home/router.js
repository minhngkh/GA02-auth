const express = require("express");
const router = express.Router();

router.get("/", (req, res, _) => {
  res.render("homepage", {
    title: "Homepage",
    buttons: [
      { name: "Login", route: "/auth/login" },
      { name: "Register", route: "/auth/register" },
    ],
  });
});

router.get("/login1", (req, res, _) => {
  res.send("Login success")
})

router.get("/login2", (req, res, _) => {
  res.send("Login failure")
})

module.exports = router;
