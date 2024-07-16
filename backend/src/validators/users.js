const { param, body } = require("express-validator");

const validateIdInParam = [
  param("uuid", "uuid is invalid").isLength({ min: 36, max: 36 }),
];

const validateUpdateUserData = [
  body("phone", "Invalid phone number").optional().isMobilePhone(),
  body("email", "Invalid email address").optional().isEmail(),
];

module.exports = {
  validateIdInParam,
  validateUpdateUserData,
};
