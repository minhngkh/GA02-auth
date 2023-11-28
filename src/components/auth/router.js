const express = require("express");
const router = express.Router();

const authenticated = require("../../lib/authenticated");
const authController = require("./controller");

router.get(
  "/login",
  authenticated.redirect("/protected"),
  authController.renderLoginPage,
);

router.post(
  "/login",
  authController.validateLoginCredentials,
  authController.craftLoginMessage,
  authController.authenticateLoginCredentials,
);

router.get(
  "/register",
  authenticated.redirect("/protected"),
  authController.renderRegisterPage,
);

router.post(
  "/register",
  authController.validateRegisterCredentials,
  authController.craftRegisterMessage,
  authController.authenticateRegisterCredentials,
);

router.get("/logout", authController.logout);

module.exports = router;
