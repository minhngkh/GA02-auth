const express = require("express");
const router = express.Router();
const protectedController = require("./controller");
const authenticated = require("../../lib/authenticated");

router.get("/", authenticated.require, protectedController.renderHomepage);

module.exports = router;
