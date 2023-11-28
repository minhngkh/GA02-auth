const express = require("express");
const router = express.Router();

const passport = require("../../lib/passport");

const { check, validationResult, body } = require("express-validator");

router.get("/login", (req, res, _) => {
  res.render("auth/login", {
    title: "Login",
    buttons: [{ name: "Register", route: "/auth/register" }],
  });
})

router.post("/login",
  body('username')
    .not().isEmpty().withMessage('You must input Username')
    .isLength({ min: 3, max: 10 }).withMessage("Your username's length must in range [3-10]")
    .matches(/^[a-zA-Z0-9]+$/).withMessage("Your username can contain only Number and Alphabet"),
  body('password')
    .not().isEmpty().withMessage("You must input password")
    .isLength({ min: 6, max: 20 }).withMessage("Your username's length must in range [6-20]"),
  (req, res, next) => {
    const errors = validationResult(req);
    const err = validationResult(req);
    if (!err.isEmpty()) {
      console.log("Validation error");
    }
    next();
  },
  passport.authenticate("login", {
    successReturnToOrRedirect: "/test/login1",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
)

router.get("/register", (req, res, _) => {
  res.render("auth/register", {
    title: "Register",
    buttons: [{ name: "Login", route: "/auth/login" }],
  })
})

const crypto = require("crypto");
router.post("/register",
  body('username')
    .not().isEmpty().withMessage('You must input Username')
    .isLength({ min: 3, max: 10 }).withMessage("Your username's length must in range [3-10]")
    .matches(/^[a-zA-Z0-9]+$/).withMessage("Your username can contain only Number and Alphabet"),
  body('email')
    .not().isEmpty().withMessage('You must input Email'),
  body('password')
    .not().isEmpty().withMessage("You must input Password")
    .isLength({ min: 6, max: 20 }).withMessage("Your password's length must in range [6-20]"),
  body('re-password')
    .not().isEmpty().withMessage("You must input Retype-password")
    .custom((value, { req }) => value === req.body.password).withMessage("Password confirmation does not match password"),
  (req, res, next) => {
    // test validator

    const err = validationResult(req);
    if (!err.isEmpty()) {
      console.log("Validation error");
      res.redirect("/auth/register")
    }
    next();
  },
  passport.authenticate("signup", {
    failureRedirect: "/auth/register",
    failureMessage: true,
  },
  (req, res) => {
    crypto.pbkdf2(
      req.body.password,
      req.body.username,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
          await db.insert(users).values({ username: req.body.username, email: req.body.email, hashed_password: hashedPassword, salt: req.body.username  });
          
        }
      },
    );
    res.redirect("/test/login1")
  })
)

router.get("/logout", (req, res, _) => {
  res.send("logout page");
});

module.exports = router;
