const express = require("express");
const router = express.Router();

require("dotenv").config();

// Controllers
const tempController = require("../controllers/template/template");
const referalController = require("../controllers/referal");

router.get("/getallreferalcode", referalController.getAllReferalCodes);

router.get("/getspeceficreferalcode/:code", referalController.getReferalCode);

router.post("/createrefralcode", referalController.createReferal);

router.delete("/removerefralcode/:referalCode", referalController.deleteReferal);

router.put("/updaterefralcode", tempController.tempData);

module.exports = router;
