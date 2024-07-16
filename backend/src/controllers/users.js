const db = require("../db/db");
const bcrypt = require("bcrypt");

const getUserById = async (req, res) => {
  try {
    const user = await db.query("SELECT * FROM users WHERE uuid = $1", [
      req.params.uuid,
    ]);
    res.json(user.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error getting user" });
  }
};

// Update user details by uuid (params)
const updateUserDetails = async (req, res) => {
  try {
    const updateDetails = {};
    const queryParams = [];

    if ("password" in req.body) {
      const hash = await bcrypt.hash(req.body.password, 12);
      queryParams.push(hash);
    }

    if ("first_name" in req.body) {
      updateDetails.first_name = req.body.first_name;
      queryParams.push(updateDetails.first_name);
    }

    if ("last_name" in req.body) {
      updateDetails.last_name = req.body.last_name;
      queryParams.push(updateDetails.last_name);
    }

    if ("phone" in req.body) {
      updateDetails.phone = req.body.phone;
      queryParams.push(updateDetails.phone);
    }

    if ("email" in req.body) {
      updateDetails.email = req.body.email;
      queryParams.push(updateDetails.email);
    }

    if (queryParams.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    queryParams.push(req.params.uuid);

    const updateQuery = `
    UPDATE users 
    SET 
      ${Object.keys(updateDetails)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ")},
      updated_at = now()
    WHERE uuid = $${queryParams.length}`;

    const result = await db.query(updateQuery, queryParams);

    if (result.rowCount === 1) {
      res.status(200).json({ message: "User details updated successfully" });
    } else {
      res.status(404).json({ error: "User not found or no changes were made" });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Failed to update user details" });
  }
};

module.exports = { getUserById, updateUserDetails };
