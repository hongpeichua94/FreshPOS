const { body } = require("express-validator");

const validateUserIdInBody = [
  body("user_id", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("user_id", "user id is required").not().isEmpty(),
];

const validateAddCartItemData = [
  body("user_id", "user id is invalid").isLength({ min: 36, max: 36 }),
  body("user_id", "user id is required").not().isEmpty(),
  body("fruit_id", "fruit id is invalid").isLength({ min: 1, max: 5 }),
  body("fruit_id", "fruit id is required").not().isEmpty(),
];

module.exports = {
  validateUserIdInBody,
  validateAddCartItemData,
};
