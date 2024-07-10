const Address = require("../models/address");
const postalAbbreviations = require("../utils/us_state");
const {
  isObjEmpty,
  generateUrl,
  getUpcomingElections,
  formatData,
} = require("../utils/utils");

const index = async (req, res) => {
  res.render("index", {
    title: "Find My Election",
    states: postalAbbreviations,
  });
};

const getElections = async (req, res) => {
  try {
    const address = new Address(req.body);
    if (!isObjEmpty(address)) {
      const url =
        //used this url from Github for testing purposes
        //for additional testing, I used the White House Address
        // "https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/state:wi/sldu:4";
        generateUrl(address);
      const elections = await getUpcomingElections(url);

      if (elections.length === 0) {
        res.render("fillerPage", {
          message: "No upcoming elections found.",
        });
      } else {
        res.render("elections", {
          title: "Upcoming Elections",
          elections: formatData(elections),
        });
      }
    }
  } catch (e) {
    console.warn(`Error in retreiving election data: ${e}`);
  }
};

module.exports = {
  index,
  getElections,
};
