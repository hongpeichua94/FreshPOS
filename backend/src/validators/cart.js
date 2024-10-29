const { body } = require("express-validator");

const validateUserIdInBody = [
  body("user_id", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("user_id", "user id is required").not().isEmpty(),
];

const validateFruitIdInBody = [
  body("fruit_id", "fruit id is invalid").isLength({ min: 1, max: 5 }),
  body("fruit_id", "fruit id is required").not().isEmpty(),
];

const validateCartIdInBody = [
  body("uuid", "cart item id is invalid").isLength({ min: 36, max: 36 }),
  body("uuid", "cart item id is required").not().isEmpty(),
];

module.exports = {
  validateUserIdInBody,
  validateFruitIdInBody,
  validateCartIdInBody,
};
