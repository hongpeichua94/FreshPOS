const express = require("express");

const {
  getAllOrders,
  createNewOrder,
  updateOrderStatusAndInventory,
} = require("../controllers/orders");

const {
  validateUserIdInBody,
  validateOrderIdInBody,
} = require("../validators/orders");

const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/order", authAdmin, getAllOrders);
router.put(
  "/order/new",
  authUser,
  validateUserIdInBody,
  errorCheck,
  createNewOrder
);
router.patch(
  "/order/new",
  authAdmin,
  validateOrderIdInBody,
  errorCheck,
  updateOrderStatusAndInventory
);

module.exports = router;