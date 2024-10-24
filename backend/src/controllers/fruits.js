const db = require("../db/db");

const path = require("path");
const multer = require("multer");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Directory where the file will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to avoid conflict
  },
});

// Set up multer middleware
const upload = multer({ storage: storage }).single("image");

const getAllFruits = async (req, res) => {
  try {
    const fruits = await db.query("SELECT * FROM fruits");

    res.json(fruits.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error getting all fruits" });
  }
};

const getFruitById = async (req, res) => {
  try {
    const fruit = await db.query("SELECT * FROM fruits WHERE id = $1", [
      req.params.id,
    ]);
    res.json(fruit.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error getting fruit" });
  }
};

const addNewFruit = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload(req, res, async function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "file upload failed", error: err });
      }

      console.log("Uploaded file:", req.file); // Debugging log

      const { name, description, price, quantity } = req.body;
      const imagePath = req.file.path;

      // Ensure that none of the required fields are missing
      if (!name || !description || !price || !quantity || !imagePath) {
        return res.status(400).json({
          status: "error",
          msg: "all fields including the image are required",
        });
      }

      await db.query(
        `INSERT INTO fruits (name,description,image,price,quantity,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
        [name, description, imagePath, price, quantity]
      );
      res.json({ status: "ok", msg: "New fruit added successfully" });
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error adding new fruit" });
  }
};

const updateFruitDetails = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload(req, res, async function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "file upload failed", error: err });
      }

      console.log("Uploaded file:", req.file); // Debugging log
      const { name, description, price, quantity } = req.body;
      const imagePath = req.file ? req.file.path : null;

      // Create an object with the fields to update
      const updateDetails = {};
      if (name) updateDetails.name = name;
      if (description) updateDetails.description = description;
      if (imagePath) updateDetails.image = imagePath;
      if (price) updateDetails.price = price;
      if (quantity) updateDetails.quantity = quantity;

      console.log(updateDetails);

      // Check if there are fields to update
      if (Object.keys(updateDetails).length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
      }

      // Prepare queryParams for the update query
      const queryParams = Object.values(updateDetails);
      queryParams.push(req.params.id);

      // Update the fruit by id
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
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "failed to update" });
  }
};

// const updateFruitDetails = async (req, res) => {
//   try {
//     const updateDetails = {};
//     const queryParams = [];

//     if ("name" in req.body) {
//       updateDetails.name = req.body.name;
//       queryParams.push(updateDetails.name);
//     }
//     if ("description" in req.body) {
//       updateDetails.description = req.body.description;
//       queryParams.push(updateDetails.description);
//     }
//     if ("image_url" in req.body) {
//       updateDetails.image_url = req.body.image_url;
//       queryParams.push(updateDetails.image_url);
//     }
//     if ("price" in req.body) {
//       updateDetails.price = req.body.price;
//       queryParams.push(updateDetails.price);
//     }
//     if ("quantity" in req.body) {
//       updateDetails.quantity = req.body.quantity;
//       queryParams.push(updateDetails.quantity);
//     }

//     if (queryParams.length === 0) {
//       return res.status(400).json({ error: "No fields provided for update" });
//     }

//     queryParams.push(req.params.id);

//     const updateQuery = `
//     UPDATE fruits
//     SET
//       ${Object.keys(updateDetails)
//         .map((key, index) => `${key} = $${index + 1}`)
//         .join(", ")},
//       updated_at = now()
//     WHERE id = $${queryParams.length}`;

//     const result = await db.query(updateQuery, queryParams);

//     if (result.rowCount === 1) {
//       res.status(200).json({ message: "Fruit details updated successfully" });
//     } else {
//       res
//         .status(404)
//         .json({ error: "Fruit not found or no changes were made" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res
//       .status(400)
//       .json({ status: "error", msg: "Failed to update fruit details" });
//   }
// };

module.exports = {
  getAllFruits,
  getFruitById,
  addNewFruit,
  updateFruitDetails,
};
