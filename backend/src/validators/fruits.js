const { body, param } = require("express-validator");

const validateIdInParam = [
  param("id", "fruit id is invalid").isLength({ min: 1, max: 5 }),
];

const validateIdInBody = [
  body("id", "fruit id is invalid").isLength({ min: 1, max: 5 }),
];

const validateAddNewFruitData = [
  body("name", "name is required").not().isEmpty(),
  body("description", "description is required").not().isEmpty(),
  body("image", "image is required").not().isEmpty(),
  body("price", "price is required").not().isEmpty().isFloat(),
  body("quantity", "quantity is required").not().isEmpty().isInt(),
];

module.exports = {
  validateIdInParam,
  validateIdInBody,
  validateAddNewFruitData,
};
