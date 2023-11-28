exports.renderHomepage = (req, res, _) => {
  let buttons = [];
  if (req.isAuthenticated()) {
    buttons = [
      { name: "Logout", route: "/auth/logout" },
      { name: "Protected", route: "/protected" },
    ];
  } else {
    buttons = [
      { name: "Login", route: "/auth/login" },
      { name: "Register", route: "/auth/register" },
    ];
  }

  res.render("big-title", {
    title: "Homepage",
    buttons: buttons,
  });
};
