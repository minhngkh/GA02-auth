const express = require("express");
const router = express.Router();

const passport = require("../../lib/passport");

const db = require("../../db/client");
const { users } = require("../../db/schema");

const { validationResult, body } = require("express-validator");

router.get("/login", (req, res, _) => {
  res.render("auth/login", {
    title: "Login",
    buttons: [{ name: "Register", route: "/auth/register" }],
  });
});

router.post(
  "/login",
  body("username")
    .notEmpty()
    .withMessage("You must input Username")
    .isLength({ min: 3, max: 10 })
    .withMessage("Your username's length must in range [3-10]")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Your username can contain only Number and Alphabet"),
  body("password")
    .notEmpty()
    .withMessage("You must input password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Your username's length must in range [6-20]"),
  (req, res, next) => {
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
  }),
);

router.get("/register", (req, res, _) => {
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
    body("email").notEmpty().isEmail().withMessage("You must input Email"),
    body("password")
      .notEmpty()
      .withMessage("You must input Password")
      .isLength({ min: 6, max: 20 })
      .withMessage("Your password's length must in range [6-20]"),
    body("re-password")
      .not()
      .isEmpty()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password confirmation does not match"),
  ],
  (req, res, next) => {
    // test validator
    const err = validationResult(req);
    if (!err.isEmpty()) {
      console.log("Validation error");
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
          })
          .catch((err) => {
            return next(err);
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
      },
    );
  },
);

router.get("/logout", (req, res, _) => {
  res.send("logout page");
});

module.exports = router;
