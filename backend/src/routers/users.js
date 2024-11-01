const express = require("express");

const { getUserById, updateUserDetails } = require("../controllers/users");

const {
  validateIdInParam,
  validateUpdateUserData,
} = require("../validators/users");

const { errorCheck } = require("../validators/errorCheck");

const { authUser } = require("../middleware/auth");

const router = express.Router();

router.get("/user/:uuid", authUser, validateIdInParam, errorCheck, getUserById);
router.patch(
  "/user/:uuid",
  authUser,
  validateIdInParam,
  validateUpdateUserData,
  errorCheck,
  updateUserDetails
);

module.exports = router;
