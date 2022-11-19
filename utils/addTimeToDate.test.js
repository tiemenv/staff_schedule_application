const { addHoursToDate, addYearsToDate, addHoursToTimestamp } = require("./addTimeToDate");

describe("addTimeToDate tests", () => {
  it("adds hours to a date object", () => {
    const date = new Date(1668848080904);
    const newDate = addHoursToDate({ numberOfHours: 1, date });
    expect(newDate).toEqual(new Date(1668851680904));
  });

  it("adds years to a date object", () => {
    const date = new Date(1668848080904);
    const newDate = addYearsToDate({ numberOfYears: 1, date });
    expect(newDate).toEqual(new Date(1700384080904));
  });

  it("adds hours to a timestamp", () => {
    const timestamp = 1668848080904;
    const newTimestamp = addHoursToTimestamp({ numberOfHours: 1, timestamp });
    expect(newTimestamp).toEqual(1668851680904);
  });
});
