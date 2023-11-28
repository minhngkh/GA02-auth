const crypto = require("crypto");
const passport = require("../../lib/passport");
const { validationResult, body } = require("express-validator");
const hashConfig = require("../../config/hashConfig");
const authService = require("./service");

// Login related
exports.renderLoginPage = (req, res, _) => {
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
};

exports.validateLoginCredentials = [
  body("username")
    .notEmpty()
    .withMessage("You must input Username")
    .isLength({ min: 3, max: 10 })
    .matches(/^[a-zA-Z0-9]+$/),
  body("password")
    .notEmpty()
    .withMessage("You must input password")
    .isLength({ min: 6, max: 20 }),
];

exports.craftLoginMessage = (req, res, next) => {
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
};

exports.authenticateLoginCredentials = passport.authenticate("local", {
  successRedirect: "/protected",
  failureRedirect: "/auth/login?error=true",
  failureMessage: true,
});

// Register related
exports.renderRegisterPage = (req, res, _) => {
  if (req.session.message) {
    res.locals.errorMsg = req.session.message;
    req.session.message = null;
  }

  res.render("auth/register", {
    title: "Register",
    buttons: [{ name: "Login", route: "/auth/login" }],
  });
};

exports.validateRegisterCredentials = [
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
    .custom((value, { req }) => {
      console.log(value);
      console.log(req.body.password);
      return value === req.body.password;
    })
    .withMessage("Password confirmation does not match"),
];

exports.craftRegisterMessage = (req, res, next) => {
  const err = validationResult(req);
  console.log(err);
  if (!err.isEmpty()) {
    req.session.message = err.array()[0].msg;
    return res.redirect("/auth/register");
  }
  next();
};

exports.authenticateRegisterCredentials = (req, res, next) => {
  const salt = crypto.randomBytes(hashConfig.saltLength);
  crypto.pbkdf2(
    req.body.password,
    salt,
    hashConfig.iterations,
    hashConfig.hashLength,
    hashConfig.func,
    async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      try {
        const result = await authService.createUser(
          req.body.username,
          req.body.email,
          hashedPassword,
          salt,
        );

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
};

// Logout related
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
