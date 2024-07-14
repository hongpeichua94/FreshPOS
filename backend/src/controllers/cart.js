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
      "SELECT a.*, b.name, b.description, b.image_url FROM cart_items a JOIN fruits b ON a.fruit_id = b.id WHERE cart_id = $1",
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
      "SELECT SUM(subtotal) as cart_total FROM cart_items WHERE cart_id = $1",
      [cartId]
    );

    const cartSubtotal = cartItemsResult.rows[0].cart_total;
    const cartTotal = 1.09 * cartSubtotal;

    // Update the cart subtotal in the cart table
    await db.query(
      "UPDATE cart SET subtotal = $1, total = $2 WHERE uuid = $3",
      [cartSubtotal, cartTotal, cartId]
    );

    res.status(200).json({ status: "success", msg: "Item added to cart" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error adding item to cart" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    await db.query("DELETE FROM cart_items WHERE uuid = $1", [req.body.uuid]);
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
  deleteCartItem,
};
