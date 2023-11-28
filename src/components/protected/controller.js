exports.renderHomepage = (req, res, _) => {
  res.render("big-title", {
    title: "Protected",
    description: "You have been logged in",
    buttons: [{ name: "Logout", route: "/auth/logout" }],
  });
};
