const express = require("express");

const {
  getCartByUserId,
  getCartItemsByUserId,
  addCartItem,
  deleteCartItem,
} = require("../controllers/cart");

const {
  validateUserIdInBody,
  validateAddCartItemData,
} = require("../validators/cart");

const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/cart", validateUserIdInBody, errorCheck, getCartByUserId);
router.get(
  "/cart/items",
  validateUserIdInBody,
  errorCheck,
  getCartItemsByUserId
);
router.put("/cart", authUser, validateAddCartItemData, errorCheck, addCartItem);
router.delete("/cart", authUser, deleteCartItem);

module.exports = router;
