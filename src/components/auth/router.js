const express = require("express");
const router = express.Router();

const passport = require("../../lib/passport");

const { check, validationResult } = require("express-validator");

const authenticated = require("../../lib/authenticated");

router.get("/login", authenticated.redirect("/protected"), (req, res, _) => {
  res.render("auth/login", {
    title: "Login",
    buttons: [{ name: "Register", route: "/auth/register" }],
  });
});

router.post(
  "/login",
  [(check("username").notEmpty(), check("password").notEmpty())],
  (req, res, next) => {
    // test validator
    const err = validationResult(req);
    if (!err.isEmpty()) {
      console.log("Validation error");
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/auth/login",
    failureMessage: true,
  }),
);

router.get("/register", authenticated.redirect("/protected"), (req, res, _) => {
  res.render("auth/register", {
    title: "Register",
    buttons: [{ name: "Login", route: "/auth/login" }],
  });
});

router.get("/login1", (req, res, _) => {
  res.send("Login success");
});

router.get("/login2", (req, res, _) => {
  res.send("Login failure");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
