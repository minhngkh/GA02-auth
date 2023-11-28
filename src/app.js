if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const os = require("os");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const hbs = require("hbs");
const passport = require("./lib/passport");
const session = require("express-session");

const RedisStore = require("connect-redis").default;
const RedisClient = require("./lib/redis");

const homeRouter = require("./components/home/router");
const authRouter = require("./components/auth/router");
const testRouter = require("./components/test/router");

// init Express app
const app = express();

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
console.log(os.hostname());
app.use(
  session({
    store: new RedisStore({ client: RedisClient }),
    secret: process.env.SESSION_SECRET,
    name: os.hostname(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    },
  }),
); // session secret
app.use(passport.authenticate("session")); // persistent login sessions

// var models = require("./app/models");

app.use("/", homeRouter);
app.use("/auth", authRouter);
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
