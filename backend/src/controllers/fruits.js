const db = require("../db/db");

const getAllFruits = async (req, res) => {
  try {
    const fruits = await db.query("SELECT * FROM fruits");

    res.json(fruits.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error getting all fruits" });
  }
};

const addNewFruit = async (req, res) => {
  try {
    await db.query(
      `INSERT INTO fruits (name,description,price,quantity,created_at,updated_at) VALUES ($1,$2,$3,$4,NOW(),NOW())`,
      [req.body.name, req.body.description, req.body.price, req.body.quantity]
    );
    res.json({ status: "ok", msg: "New fruit added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error adding new fruit" });
  }
};

const updateFruitDetails = async (req, res) => {
  try {
    const updateDetails = {};
    const queryParams = [];

    if ("name" in req.body) {
      updateDetails.name = req.body.name;
      queryParams.push(updateDetails.name);
    }
    if ("description" in req.body) {
      updateDetails.description = req.body.description;
      queryParams.push(updateDetails.description);
    }
    if ("image_url" in req.body) {
      updateDetails.image_url = req.body.image_url;
      queryParams.push(updateDetails.image_url);
    }
    if ("price" in req.body) {
      updateDetails.price = req.body.price;
      queryParams.push(updateDetails.price);
    }
    if ("quantity" in req.body) {
      updateDetails.quantity = req.body.quantity;
      queryParams.push(updateDetails.quantity);
    }

    if (queryParams.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    queryParams.push(req.params.id);

    const updateQuery = `
    UPDATE fruits 
    SET 
      ${Object.keys(updateDetails)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ")},
      updated_at = now()
    WHERE id = $${queryParams.length}`;

    const result = await db.query(updateQuery, queryParams);

    if (result.rowCount === 1) {
      res.status(200).json({ message: "Fruit details updated successfully" });
    } else {
      res
        .status(404)
        .json({ error: "Fruit not found or no changes were made" });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to update fruit details" });
  }
};

module.exports = {
  getAllFruits,
  addNewFruit,
  updateFruitDetails,
};
