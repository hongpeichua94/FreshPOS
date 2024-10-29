const express = require("express");

const {
  getAllFruits,
  getFruitById,
  addNewFruit,
  updateFruitDetails,
  deleteFruit,
} = require("../controllers/fruits");

const { validateIdInParam, validateIdInBody } = require("../validators/fruits");

const { errorCheck } = require("../validators/errorCheck");

const { authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/fruit", getAllFruits);
router.get("/fruit/:id", validateIdInParam, errorCheck, getFruitById);
router.post("/fruit/add", authAdmin, addNewFruit);
router.patch("/fruit/:id", authAdmin, updateFruitDetails);
router.delete("/fruit", authAdmin, validateIdInBody, errorCheck, deleteFruit);

module.exports = router;
