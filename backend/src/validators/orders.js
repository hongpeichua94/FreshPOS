const { body } = require("express-validator");

const validateUserIdInBody = [
  body("uuid", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("uuid", "user id is required").not().isEmpty(),
];

const validateOrderIdInBody = [
  body("uuid", "order id is invalid").isLength({ min: 36, max: 36 }),
  body("uuid", "order id is required").not().isEmpty(),
];

module.exports = {
  validateUserIdInBody,
  validateOrderIdInBody,
};
