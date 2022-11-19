module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define("schedules", {
    start: {
      type: Sequelize.DATE,
    },
    end: {
      type: Sequelize.DATE,
    },
    hours: {
      type: Sequelize.INTEGER,
    },
  }, {
    paranoid: true,
  });

  return Schedule;
};
