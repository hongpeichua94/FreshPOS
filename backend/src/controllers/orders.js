const db = require("../db/db");

const getAllOrders = async (req, res) => {
  try {
    let query = `
    WITH order_summary as (
      SELECT
        b.created_at,
        b.uuid, 
        STRING_AGG(CONCAT(a.quantity, ' x ', c.name)::text, ', ') AS items,
        b.subtotal, 
        b.total, 
        b.status,
        b.user_id
      FROM order_items a
      JOIN orders b ON a.order_id = b.uuid
      JOIN fruits c on a.fruit_id = c.id
      GROUP BY 1,2,4,5,6)
      
      SELECT
        a.*,
        b.email,
        b.first_name,
        b.last_name,
        b.phone
      FROM order_summary a
      JOIN users b ON a.user_id = b.uuid`;

    const allOrders = await db.query(query);
    res.json(allOrders.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error getting order details" });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    let query = `
      SELECT
        b.created_at,
        b.uuid, 
        STRING_AGG(CONCAT(a.quantity, ' x ', c.name)::text, ', ') AS items,
        b.subtotal, 
        b.total, 
        b.status
      FROM order_items a
      JOIN orders b ON a.order_id = b.uuid
      JOIN fruits c on a.fruit_id = c.id
      WHERE b.user_id = $1
      GROUP BY 1,2,4,5,6`;

    const allOrders = await db.query(query, [req.body.user_id]);
    res.json(allOrders.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error getting order details" });
  }
};

const createNewOrder = async (req, res) => {
  try {
    // Retrieve cart id
    const cartResult = await db.query(
      "SELECT uuid as cart_id FROM cart WHERE user_id = $1",
      [req.body.user_id]
    );

    const cartId = cartResult.rows[0].cart_id;

    // Retrieve cart items
    const cartItemsResult = await db.query(
      "SELECT a.*, b.name, b.description, b.image_url FROM cart_items a JOIN fruits b ON a.fruit_id = b.id WHERE cart_id = $1",
      [cartId]
    );

    const cartItems = cartItemsResult.rows;

    // Create new order entry in orders table
    const orderResult = await db.query(
      "INSERT INTO orders (user_id, created_at) VALUES ($1, NOW()) RETURNING uuid",
      [req.body.user_id]
    );

    const orderId = orderResult.rows[0].uuid;

    // Insert items into the order_items table
    for (let cartItem of cartItems) {
      await db.query(
        `INSERT INTO order_items (order_id, fruit_id, quantity, subtotal)
         VALUES ($1, $2, $3, $4)`,
        [orderId, cartItem.fruit_id, cartItem.quantity, cartItem.subtotal]
      );
    }

    // Calculate the order subtotal
    const orderItemsResult = await db.query(
      "SELECT SUM(subtotal) as order_total FROM order_items WHERE order_id = $1",
      [orderId]
    );

    const orderSubtotal = orderItemsResult.rows[0].order_total;
    const orderTotal = 1.09 * orderSubtotal;

    // Create new payment entry in payments table
    const paymentResult = await db.query(
      "INSERT INTO payments (payment_amount, created_at) VALUES ($1, NOW()) RETURNING uuid",
      [orderTotal]
    );

    const paymentId = paymentResult.rows[0].uuid;

    // Create new delivery entry in delivery table
    const deliveryResult = await db.query(
      "INSERT INTO delivery (created_at) VALUES (NOW()) RETURNING uuid"
    );

    const deliveryId = deliveryResult.rows[0].uuid;

    // Update the order subtotal and total in the orders table
    await db.query(
      "UPDATE orders SET subtotal = $1, total = $2, payment_id = $3, delivery_id = $4 WHERE uuid = $5",
      [orderSubtotal, orderTotal, paymentId, deliveryId, orderId]
    );

    // Clear the cart items after creating the order
    await db.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

    // Clear cart total
    await db.query("UPDATE cart SET subtotal = 0, total = 0 WHERE uuid = $1", [
      cartId,
    ]);

    res.json({ status: "success", orderId });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error creating new order" });
  }
};

const updateOrderStatusAndInventory = async (req, res) => {
  try {
    const updateOrderStatusQuery = `
      UPDATE orders
      SET
        status = $1,
        updated_at = NOW()
      WHERE uuid = $2`;

    await db.query(updateOrderStatusQuery, [req.body.status, req.body.uuid]);

    const orderResult = await db.query("SELECT * FROM orders");

    const orderStatus = orderResult.rows[0].status;
    const paymentId = orderResult.rows[0].payment_id;
    const deliveryId = orderResult.rows[0].delivery_id;

    // Check if order status is 'CONFIRMED'
    if (orderStatus === "CONFIRMED") {
      const soldResult = await db.query(
        `SELECT
          fruit_id,
          name,
          sum(a.quantity) as total_sold
        FROM order_items a
        JOIN orders b ON a.order_id = b.uuid
        JOIN fruits c ON a.fruit_id = c.id
        WHERE b.status = 'CONFIRMED'
        GROUP BY 1,2
        `
      );

      // Iterate over each row
      for (const row of soldResult.rows) {
        const fruitId = row.fruit_id;
        const totalSold = row.total_sold;

        // Update inventory table
        const updateInventoryQuery = `
        UPDATE fruits
        SET sold = $1
        WHERE id = $2`;

        await db.query(updateInventoryQuery, [totalSold, fruitId]);
      }

      // Update payment status
      await db.query(
        "UPDATE payments SET payment_method = $1, status = 'SUCCEED' WHERE uuid = $2",
        [req.body.payment_method, paymentId]
      );

      // Update delivery status
      await db.query(
        "UPDATE delivery SET delivery_method = $1, delivery_address = $2, status = 'SCHEDULED' WHERE uuid = $3",
        [req.body.delivery_method, req.body.delivery_address, deliveryId]
      );
    }
    res.status(200).json({
      status: "success",
      msg: "Order status and inventory updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error updating order status" });
  }
};

module.exports = {
  getAllOrders,
  getOrdersByUserId,
  createNewOrder,
  updateOrderStatusAndInventory,
};
