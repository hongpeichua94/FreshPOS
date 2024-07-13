const { param } = require("express-validator");

const validateIdInParam = [
  param("uuid", "uuid is invalid").isLength({ min: 36, max: 36 }),
];

module.exports = {
  validateIdInParam,
};
