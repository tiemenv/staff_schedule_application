const Sequelize = require("sequelize");
const dbConfig = require("../../config/db");
const userModel = require("./user");
const roleModel = require("./role");
const scheduleModel = require("./schedule");

// problem here: coupling to sequelize library

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  },
);

const db = {
  Sequelize,
  sequelize,
  user: userModel(sequelize, Sequelize),
  role: roleModel(sequelize, Sequelize),
  schedule: scheduleModel(sequelize, Sequelize),
};

/**
 * ROLE: belongsToMany users

USER: hasMany roles, hasMany schedules

SCHEDULE: belongsTo user */

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.schedule.belongsTo(db.user);

db.user.hasMany(db.schedule);

module.exports = db;
