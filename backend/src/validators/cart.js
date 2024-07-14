const { body } = require("express-validator");

const validateUserIdInBody = [
  body("uuid", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("uuid", "user id is required").not().isEmpty(),
];

const validateAddCartItemData = [
  body("uuid", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("uuid", "user id is required").not().isEmpty(),
  body("id", "fruit id is invalid").isLength({ min: 1, max: 5 }),
  body("id", "fruit id is required").not().isEmpty(),
];

module.exports = {
  validateUserIdInBody,
  validateAddCartItemData,
};
