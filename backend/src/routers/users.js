const express = require("express");

const { updateUserDetails } = require("../controllers/users");

const { validateIdInParam } = require("../validators/users");

const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.patch(
  "/user/:uuid",
  authUser,
  validateIdInParam,
  errorCheck,
  updateUserDetails
);

module.exports = router;
