const mongoose = require("mongoose");
const postalAbbreviations = require("../utils/us_state");

//added in a schema for the address
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
