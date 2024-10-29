const express = require("express");

const {
  getCartByUserId,
  getCartItemsByUserId,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cart");

const {
  validateUserIdInBody,
  validateFruitIdInBody,
  validateCartIdInBody,
} = require("../validators/cart");

const { errorCheck } = require("../validators/errorCheck");

const { authUser } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/cart",
  authUser,
  validateUserIdInBody,
  errorCheck,
  getCartByUserId
);
router.post(
  "/cart/items",
  authUser,
  validateUserIdInBody,
  errorCheck,
  getCartItemsByUserId
);
router.put(
  "/cart",
  authUser,
  validateUserIdInBody,
  validateFruitIdInBody,
  errorCheck,
  addCartItem
);
router.patch(
  "/cart/items",
  authUser,
  validateCartIdInBody,
  errorCheck,
  updateCartItem
);
router.delete(
  "/cart",
  authUser,
  validateCartIdInBody,
  errorCheck,
  deleteCartItem
);

module.exports = router;
