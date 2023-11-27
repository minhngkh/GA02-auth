const express = require("express");
const router = express.Router();

const db = require("../../db/connection");
const { users } = require("../../db/schema");
const passport = require("../../lib/passport")

const { check, validationResult } = require('express-validator');

router.get("/login", (req, res, _) => {
  res.render("auth/login", {
    title: "Login",
    buttons: [{ name: "Register", route: "/auth/register" }],
  });
});

router.post("/login", [
  check('username').not().isEmpty().withMessage('Name must have more than 5 characters'),
  check('password', 'Your password must be at least 5 characters').not().isEmpty(),
], function (req, res) {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  } else {
    res.send({});
  }
}), passport.authenticate('local', {
  successRedirect: '../../',
  failureRedirect: '../../login2',
  failureMessage: true,
});


router.get("/register", (req, res, _) => {
  res.render("auth/register", {
    title: "Register",
    buttons: [{ name: "Login", route: "/auth/login" }],
  });
});

router.get("/login1", (req, res, _) => {
  res.send("Login success")
})

router.get("/login2", (req, res, _) => {
  res.send("Login failure")
})

router.get("/logout", (req, res, _) => {
  res.send("logout page");
});

module.exports = router;
