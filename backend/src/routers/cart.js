const express = require("express");

const {
  getCartByUserId,
  getCartItemsByUserId,
  addCartItem,
  deleteCartItem,
} = require("../controllers/cart");

// const {
//   validateUserIdInBody,
//   validateAddCartItemData,
// } = require("../validators/cart");

const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/cart", getCartByUserId);
router.get("/cart/items", getCartItemsByUserId);
router.put("/cart", authUser, addCartItem);
router.delete("/cart", authUser, deleteCartItem);

module.exports = router;
