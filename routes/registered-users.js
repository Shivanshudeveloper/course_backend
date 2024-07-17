const express = require("express");
const router = express.Router();

require("dotenv").config();

// Controllers
const registeredUsersController = require("../controllers/registeredusers");


router.get("/getallusersregistered/:isadmin", registeredUsersController.getAllUsers);
router.get("/getuserdatacertificate/:email", registeredUsersController.getAllUserDataCertificate);

module.exports = router;
