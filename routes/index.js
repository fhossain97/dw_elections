const express = require("express");
const router = express.Router();
const addressCtrl = require("../controllers/addressController.js");

router.get("/", addressCtrl.index);
router.post("/", addressCtrl.getElections);

module.exports = router;
