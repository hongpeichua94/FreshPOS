const express = require("express");

const {
  getAllFruits,
  getFruitById,
  addNewFruit,
  updateFruitDetails,
  deleteFruit,
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
router.post("/fruit/add", authAdmin, addNewFruit);
router.patch("/fruit/:id", authAdmin, updateFruitDetails);
router.delete("/fruit", authAdmin, deleteFruit);

module.exports = router;
