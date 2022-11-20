const { verifyToken, requireAdmin } = require("../middleware/jwtAuth");
const controller = require("../contollers/user");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept",
    );
    next();
  });

  // get users list
  app.get(
    "/users/",
    [verifyToken],
    controller.getUsers,
  );

  // edit user role
  app.put(
    "/users/:userId",
    [
      verifyToken,
      requireAdmin,
    ],
    controller.updateUser,
  );

  // delete user
  app.delete(
    "/users/:userId",
    [
      verifyToken,
      requireAdmin,
    ],
    controller.deleteUser,
  );
};
