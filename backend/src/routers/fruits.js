const express = require("express");

const {
  getAllFruits,
  addNewFruit,
  updateFruitDetails,
} = require("../controllers/fruits");

const {
  validateIdInParam,
  validateAddNewFruitData,
} = require("../validators/fruits");

const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/fruits", getAllFruits);
router.put(
  "/fruit/add",
  authAdmin,
  validateAddNewFruitData,
  errorCheck,
  addNewFruit
);
router.patch(
  "/fruit/:id",
  authAdmin,
  validateIdInParam,
  errorCheck,
  updateFruitDetails
);

module.exports = router;
