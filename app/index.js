// could use require syntax on older node versions
const express = require("express");
const cookieSession = require("cookie-session");
const cors = require("cors");
const db = require("./repositories/models");
const ScheduleService = require("./services/ScheduleService");
const ScheduleMySqlRepo = require("./repositories/ScheduleMySqlRepo");
const UserService = require("./services/UserService");
const UserMySqlRepo = require("./repositories/UserMySqlRepo");

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
 * @param {boolean} options.reset
 * @returns {Promise<void>}
 */
const initializeDb = async ({ reset = false }) => {
  if (reset === true) {
    await db.sequelize.sync({ force: true });
    console.log("drop and resync db");
    Role.create({
      id: 1,
      name: "user",
    });
    Role.create({
      id: 2,
      name: "admin",
    });
  } else {
    await db.sequelize.sync();
  }
};

ScheduleService.initService(ScheduleMySqlRepo);
UserService.initService(UserMySqlRepo);

initializeDb({ reset: false });

// routes
require("./routes/auth")(app);
require("./routes/user")(app);
require("./routes/schedule")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
