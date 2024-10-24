const db = require("../db/db");

const getCartByUserId = async (req, res) => {
  try {
    const cartSummary = await db.query(
      "SELECT * FROM cart WHERE user_id = $1",
      [req.body.user_id]
    );
    res.json(cartSummary.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error getting cart details" });
  }
};

const getCartItemsByUserId = async (req, res) => {
  try {
    const cartResult = await db.query(
      "SELECT uuid as cart_id FROM cart WHERE user_id = $1",
      [req.body.user_id]
    );

    const cartId = cartResult.rows[0].cart_id;

    const cartItems = await db.query(
      "SELECT a.*, b.name, b.description, b.image FROM cart_items a JOIN fruits b ON a.fruit_id = b.id WHERE cart_id = $1",
      [cartId]
    );
    res.json(cartItems.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error getting cart items" });
  }
};

const addCartItem = async (req, res) => {
  try {
    const cartResult = await db.query(
      "SELECT uuid as cart_id FROM cart WHERE user_id = $1",
      [req.body.user_id]
    );

    const cartId = cartResult.rows[0].cart_id;

    // Get the fruit price
    const fruitResult = await db.query(
      "SELECT price FROM fruits WHERE id = $1",
      [req.body.fruit_id]
    );

    const fruitPrice = fruitResult.rows[0].price;

    // Calculate the subtotal for the item
    const quantity = req.body.quantity;
    const itemSubtotal = fruitPrice * quantity;

    // Check if the fruit already exists in the cart
    const cartItemResult = await db.query(
      "SELECT uuid, quantity FROM cart_items WHERE cart_id = $1 AND fruit_id = $2",
      [cartId, req.body.fruit_id]
    );

    if (cartItemResult.rows.length > 0) {
      // If the fruit already exists in the cart, update the quantity and subtotal
      const newQuantity = cartItemResult.rows[0].quantity + quantity;
      const newItemSubtotal = fruitPrice * newQuantity;

      await db.query(
        "UPDATE cart_items SET quantity = $1, subtotal = $2 WHERE uuid = $3",
        [newQuantity, newItemSubtotal, cartItemResult.rows[0].uuid]
      );
    } else {
      // If the fruit does not already exists in the cart, add the item to the cart
      await db.query(
        "INSERT INTO cart_items (cart_id, fruit_id, quantity, subtotal) VALUES ($1, $2, $3, $4)",
        [cartId, req.body.fruit_id, quantity, itemSubtotal]
      );
    }

    // Calculate the updated cart subtotal
    const cartItemsResult = await db.query(
      "SELECT SUM(subtotal) as cart_total, SUM(quantity) as cart_quantity FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    const cartQuantity = cartItemsResult.rows[0].cart_quantity;
    const cartSubtotal = cartItemsResult.rows[0].cart_total;
    const cartTotal = 1.09 * cartSubtotal;

    // Update the cart subtotal in the cart table
    await db.query(
      "UPDATE cart SET subtotal = $1, total = $2, quantity = $3 WHERE uuid = $4",
      [cartSubtotal, cartTotal, cartQuantity, cartId]
    );

    res.status(200).json({ status: "success", msg: "Item added to cart" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error adding item to cart" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    // Retrieve cart item
    const cartItemResult = await db.query(
      "SELECT * FROM cart_items WHERE uuid = $1",
      [req.body.uuid]
    );

    const cartItem = cartItemResult.rows[0];

    // Update the quantity and subtotal
    let finalQuantity = cartItem.quantity;

    if ("quantity" in req.body) {
      // Increment the quantity by the number passed in the request body
      finalQuantity = req.body.quantity;
    }

    // Retrieve fruit details for subtotal calculation
    const fruitResult = await db.query("SELECT * FROM fruits WHERE id = $1", [
      cartItem.fruit_id,
    ]);

    const fruitPrice = fruitResult.rows[0].price;
    const updatedSubtotal = finalQuantity * fruitPrice;

    // Update the cart item with the new quantity and subtotal
    await db.query(
      "UPDATE cart_items SET quantity = $1, subtotal = $2 WHERE uuid = $3",
      [finalQuantity, updatedSubtotal, req.body.uuid]
    );

    // Calculate the updated cart quantity and subtotal
    const cartId = cartItem.cart_id;

    const updatedCartItemResult = await db.query(
      "SELECT SUM(subtotal) as cart_total, SUM(quantity) as cart_quantity FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    const newCartQuantity = updatedCartItemResult.rows[0].cart_quantity;
    const newCartSubtotal = updatedCartItemResult.rows[0].cart_total;
    const newCartTotal = 1.09 * newCartSubtotal;

    // Update the cart with the new quantity and subtotal
    await db.query(
      "UPDATE cart SET subtotal = $1, total= $2, quantity =$3 WHERE uuid =$4",
      [newCartSubtotal, newCartTotal, newCartQuantity, cartId]
    );
    res.json({ status: "ok", msg: "Item quantity updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ status: "error", msg: "Error updating cart" });
  }
};

// Delete cart item must update cart summary also
const deleteCartItem = async (req, res) => {
  try {
    const cartItemResult = await db.query(
      "SELECT cart_id FROM cart_items WHERE uuid = $1",
      [req.body.uuid]
    );

    const cartId = cartItemResult.rows[0].cart_id;

    await db.query("DELETE FROM cart_items WHERE uuid = $1", [req.body.uuid]);

    // Calculate the updated cart subtotal
    const cartItemsResult = await db.query(
      "SELECT SUM(subtotal) as cart_total, SUM(quantity) as cart_quantity FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    const newCartQuantity = cartItemsResult.rows[0].cart_quantity;
    const newCartSubtotal = cartItemsResult.rows[0].cart_total;
    const newCartTotal = 1.09 * newCartSubtotal;

    // Update the cart subtotal in the cart table
    await db.query(
      "UPDATE cart SET subtotal = $1, total = $2, quantity = $3 WHERE uuid = $4",
      [newCartSubtotal, newCartTotal, newCartQuantity, cartId]
    );

    res.json({ status: "ok", msg: "Item removed from cart" });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error removing item from cart" });
  }
};

module.exports = {
  getCartByUserId,
  getCartItemsByUserId,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};
