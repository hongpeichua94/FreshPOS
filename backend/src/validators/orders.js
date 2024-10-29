const { body } = require("express-validator");

const validateUserIdInBody = [
  body("user_id", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("user_id", "user id is required").not().isEmpty(),
];

const validateOrderIdInBody = [
  body("uuid", "order id is invalid").isLength({ min: 36, max: 36 }),
  body("uuid", "order id is required").not().isEmpty(),
];

module.exports = {
  validateUserIdInBody,
  validateOrderIdInBody,
};
