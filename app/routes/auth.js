const controller = require("../contollers/auth");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
    );
    next();
  });

  app.post(
    "/auth/register",
    controller.register,
  );

  app.post("/auth/login", controller.login);

  app.post("/auth/logout", controller.logout);
};
