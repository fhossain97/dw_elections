var tap = require("tap");
var postalAbbreviations = require("../utils/us_state");

const employeeStates = [
  "AR",
  "CA",
  "CO",
  "DC",
  "IL",
  "MN",
  "NY",
  "OR",
  "RI",
  "TN",
  "VA",
  "WA",
];

tap.equal(
  postalAbbreviations.length,
  61,
  "there are 61 states, territories, military abbreviations, etc."
);

employeeStates.forEach((abbr) => {
  tap.ok(
    postalAbbreviations.includes(abbr),
    `postalAbbreviations contains ${abbr}`
  );
});
