const express = require("express");
const router = express.Router();

const authenticated = require("../../lib/authenticated");

router.get("/", (req, res, _) => {
  let buttons = [];
  if (req.isAuthenticated()) {
    buttons = [
      { name: "Logout", route: "/auth/logout" },
      { name: "Protected", route: "/protected" },
    ];
  } else {
    buttons = [
      { name: "Login", route: "/auth/login" },
      { name: "Register", route: "/auth/register" },
    ];
  }

  res.render("big-title", {
    title: "Homepage",
    buttons: buttons,
  });
});

router.get("/protected", authenticated.require, (req, res, _) => {
  res.render("big-title", {
    title: "Protected",
    buttons: [{ name: "Logout", route: "/auth/logout" }],
  });
});

module.exports = router;
