if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const hbs = require("hbs");
const passport = require("./lib/passport");
const session = require("./lib/session");

const homeRouter = require("./components/home/router");
const authRouter = require("./components/auth/router");
const protectedRouter = require("./components/protected/router");
const testRouter = require("./components/test/router");

// init Express app
const app = express();

// trust proxy
app.set("trust proxy", 1);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
// app.set("view options", { layout: "layout/default.hbs" });
hbs.registerPartials(path.join(__dirname, "views/partials"));
hbs.registerHelper("parseJSON", (data, options) => {
  return options.fn(JSON.parse(data));
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// TODO: Implement CSRF protection
// setup Passport
app.use(session);
app.use(passport.authenticate("session")); // persistent login sessions

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/protected", protectedRouter);
app.use("/test", testRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
