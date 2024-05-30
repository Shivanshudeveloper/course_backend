const express = require("express");
const router = express.Router();

require("dotenv").config();

// Controllers
const referalController = require("../controllers/referal");
const ambassadorController = require("../controllers/ambassador");

router.get("/getallambassador", ambassadorController.getAllAmbassador);

router.get("/getallambassadorpayout/:publicId", ambassadorController.getAllAmbassadorPayout);

router.get("/getspeceficreferalcode/:code", referalController.getReferalCode);

router.post("/create", ambassadorController.createAmbassador);

router.delete("/removerefralcode/:referalCode", referalController.deleteReferal);

router.put("/updaterefralcode", referalController.deleteReferal);

module.exports = router;
