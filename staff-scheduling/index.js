// could use require syntax on older node versions
const express = require("express");
const cookieSession = require("cookie-session");
const cors = require("cors");
const db = require("./app/repositories/models");
const ScheduleService = require("./app/services/ScheduleService");
const ScheduleMySqlRepo = require("./app/repositories/ScheduleMySqlRepo");
const UserService = require("./app/services/UserService");
const UserMySqlRepo = require("./app/repositories/UserMySqlRepo");

require("dotenv").config();

const app = express();

// use cors middleware
app.use(cors());

// can add more content types to parse when required, for now, JSON will do
app.use(express.json());

app.use(cookieSession({
  name: "session",
  secret: process.env.COOKIE_SECRET,
  // prevent access by client-side JS
  httpOnly: true,
}));

const Role = db.role;

// TODO: this DB logic should be extracted out since now we're coupled to sequelize
/**
 *
 * @param {Object} options
 * @param {boolean} [options.force]
 * @returns {Promise<void>}
 */
const initializeDb = async ({ force = false }) => {
  await db.sequelize.sync({ force });
  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "admin",
  });
};

ScheduleService.initService(ScheduleMySqlRepo);
UserService.initService(UserMySqlRepo);

initializeDb({ force: false });

// routes
require("./app/routes/auth")(app);
require("./app/routes/user")(app);
require("./app/routes/schedule")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
