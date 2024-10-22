const express = require("express");

const {
  getCartByUserId,
  getCartItemsByUserId,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cart");

// const {
//   validateUserIdInBody,
//   validateAddCartItemData,
// } = require("../validators/cart");

// const { errorCheck } = require("../validators/errorCheck");

const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/cart", getCartByUserId);
router.post("/cart/items", getCartItemsByUserId);
router.put("/cart", authUser, addCartItem);
router.patch("/cart/items", authUser, updateCartItem);
router.delete("/cart", authUser, deleteCartItem);

module.exports = router;
