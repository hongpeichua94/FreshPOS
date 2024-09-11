const express = require("express");

const {
  getAllFruits,
  getFruitById,
  addNewFruit,
  updateFruitDetails,
} = require("../controllers/fruits");

// const {
//   validateIdInParam,
//   validateAddNewFruitData,
// } = require("../validators/fruits");

// const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/fruit", getAllFruits);
router.get("/fruit/:id", getFruitById);
router.put("/fruit/add", authAdmin, addNewFruit);
router.patch("/fruit/:id", authAdmin, updateFruitDetails);

module.exports = router;
