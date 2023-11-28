const express = require("express");
const router = express.Router();

const passport = require("../../lib/passport");
const db = require("../../db/client");
const { users } = require("../../db/schema");
const { validationResult, body } = require("express-validator");
const authenticated = require("../../lib/authenticated");

router.get("/login", authenticated.redirect("/protected"), (req, res, _) => {
  if (req.session.message) {
    res.locals.errorMsg = req.session.message;
    req.session.message = null;
  } else if (req.query.error === "true") {
    res.locals.errorMsg = "Username or Password is incorrect";
  }

  res.render("auth/login", {
    title: "Login",
    buttons: [{ name: "Register", route: "/auth/register" }],
  });
});

router.post(
  "/login",
  [
    body("username")
      .notEmpty()
      .withMessage("You must input Username")
      .isLength({ min: 3, max: 10 })
      .matches(/^[a-zA-Z0-9]+$/),
    body("password")
      .notEmpty()
      .withMessage("You must input password")
      .isLength({ min: 6, max: 20 }),
  ],
  (req, res, next) => {
    // test validator
    const err = validationResult(req);
    if (!err.isEmpty()) {
      console.log(req.session.messages);
      req.session.message = err.array()[0].msg;
      if (req.session.message === "Invalid value") {
        req.session.message = "Username or Password is incorrect";
      }

      return res.redirect("/auth/login");
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/auth/login?error=true",
    failureMessage: true,
  }),
);

router.get("/register", authenticated.redirect("/protected"), (req, res, _) => {
  if (req.session.message) {
    res.locals.errorMsg = req.session.message;
    req.session.message = null;
  }

  res.render("auth/register", {
    title: "Register",
    buttons: [{ name: "Login", route: "/auth/login" }],
  });
});

const crypto = require("crypto");
router.post(
  "/register",
  [
    body("username")
      .notEmpty()
      .withMessage("You must input Username")
      .isLength({ min: 3, max: 10 })
      .withMessage("Your username's length must in range [3-10]")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Your username can contain only Number and Alphabet"),
    body("email")
      .notEmpty()
      .withMessage("You must input Email")
      .isEmail()
      .withMessage("Your email is invalid"),
    body("password")
      .notEmpty()
      .withMessage("You must input Password")
      .isLength({ min: 6, max: 20 })
      .withMessage("Your password's length must in range [6-20]"),
    body("re-password")
      .notEmpty()
      .withMessage("You must input Password confirmation")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password confirmation does not match"),
  ],
  (req, res, next) => {
    // test validator
    const err = validationResult(req);
    if (!err.isEmpty()) {
      req.session.message = err.array()[0].msg;
      return res.redirect("/auth/register");
    }
    next();
  },
  (req, res, next) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        try {
          const result = await db
            .insert(users)
            .values({
              username: req.body.username,
              email: req.body.email,
              hashed_password: hashedPassword,
              salt: salt,
            })
            .returning({
              insertedId: users.id,
            });

          req.login(
            {
              id: result.insertedId,
              username: req.body.username,
            },
            (err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/protected");
            },
          );
        } catch (err) {
          req.session.message = "Username or Email already exists";
          return res.redirect("/auth/register");
        }
      },
    );
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
