function isObjEmpty(obj) {
  return obj && Object.keys(obj).length === 0;
}

function generateUrl(addressObj) {
  // For the purposes of this project, I'm explicitly including state and place in the links. However, as per the documentation, more paramaters can be searched for and this function would need to be modified to reflect that.
  const { state, city } = addressObj;
  const formattedState = state.toLowerCase().trim();
  const formattedCity = city.toLowerCase().replaceAll(" ", "_");
  const url = new URL(`https://api.turbovote.org/elections/upcoming`);
  const stateLink = `ocd-division/country:us/state:${formattedState}`;
  const cityLink = `ocd-division/country:us/state:${formattedState}/place:${formattedCity}`;
  url.searchParams.append(
    "district-divisions",
    `${stateLink.concat(",", cityLink)}`
  );
  return decodeURIComponent(url.href);
}

async function getUpcomingElections(url) {
  //Doc link: https://developers.democracy.works/api/v1?utm_source=dwwebsite&utm_medium=navbar#/paths/~1elections~1upcoming/get
  //For future cases, would add additional param of retrieving docs with qa-status: complete. Added this instead in the formatData function

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    }).then((res) => res.json());

    if (typeof response === "object" && response.length > 0) {
      return response;
    } else {
      return [];
    }
  } catch (e) {
    console.warn(`Error while making API request for upcoming elections: ${e}`);
  }
}

const formatDate = (date) => {
  const newDate = new Date(date);
  return `${
    newDate.getMonth() + 1
  }-${newDate.getDate()}-${newDate.getFullYear()}`;
};

const formatData = (data) => {
  // For the purposes of displaying the data, assuming these fields will be beneficial for the user
  // Additionally, I would refactor this in the future since my logic could be simplified or use a helper function to determine if the key exists in the obj - for now I have a ternary expression
  return data
    .filter((obj) => obj["qa-status"] === "complete")
    .map((obj) => {
      return {
        description: obj.description ? obj.description : "N/A",
        date: obj.date ? formatDate(obj.date) : null,
        polling_url: obj["polling-place-url"] ? obj["polling-place-url"] : null,
        methods: obj["district-divisions"].map((div) => {
          return {
            voting_methods: div["voting-methods"].map((vm) => {
              return {
                type: vm.type,
                instructions: vm.instructions
                  ? vm.instructions["voting-id"]
                  : null,
                startEV: vm.start ? formatDate(vm.start) : null,
                endEV: vm.end ? formatDate(vm.end) : null,
                ballet_url: vm["ballot-request-form-url"]
                  ? vm["ballot-request-form-url"]
                  : null,
                ballet_deadline: vm["ballot-request-deadline-received"]
                  ? formatDate(vm["ballot-request-deadline-received"])
                  : null,
              };
            }),
            voter_registration_methods: div["voter-registration-methods"].map(
              (vrm) => {
                return {
                  type: vrm.type,
                  endIP: vrm.end,
                  online_url: vrm.url ? vrm.url : null,
                  online_deadline: vrm["deadline-online"]
                    ? formatDate(vrm["deadline-online"])
                    : null,
                  mail_url: vrm["registration-form-url"]
                    ? vrm["registration-form-url"]
                    : null,
                  mail_deadline: vrm["deadline-postmarked"]
                    ? formatDate(vrm["deadline-postmarked"])
                    : null,
                  instructions: vrm.instructions
                    ? {
                        id_info: vrm.instructions.idnumber
                          ? vrm.instructions.idnumber
                          : null,
                        race_info: vrm.instructions.race
                          ? vrm.instructions.race
                          : null,
                        requirements: vrm.instructions.signature
                          ? vrm.instructions.signature
                          : null,
                        registration: vrm.instructions.registration
                          ? vrm.instructions.registration
                          : null,
                      }
                    : null,
                };
              }
            ),
          };
        }),
      };
    });
};

module.exports = {
  generateUrl,
  isObjEmpty,
  getUpcomingElections,
  formatDate,
  formatData,
};
