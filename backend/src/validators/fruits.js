const { body, param } = require("express-validator");

const validateIdInParam = [
  param("id", "id is invalid").isLength({ min: 1, max: 5 }),
];

const validateAddNewFruitData = [
  body("name", "name is required").not().isEmpty(),
  body("price", "price is required").not().isEmpty(),
  body("quantity", "quantity is required").not().isEmpty(),
];

module.exports = {
  validateIdInParam,
  validateAddNewFruitData,
};
