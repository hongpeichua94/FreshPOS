const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "freshfruits",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
