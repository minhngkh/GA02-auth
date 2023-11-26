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

module.exports = router;
