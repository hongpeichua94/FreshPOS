const express = require("express");

const {
  getAllOrders,
  getOrdersByUserId,
  createNewOrder,
  updateOrderStatusAndInventory,
} = require("../controllers/orders");

// const {
//   validateUserIdInBody,
//   validateOrderIdInBody,
// } = require("../validators/orders");

// const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/order", authAdmin, getAllOrders);
router.post("/order", authUser, getOrdersByUserId);
router.put("/order/new", authUser, createNewOrder);
router.patch("/order/new", authAdmin, updateOrderStatusAndInventory);

module.exports = router;
