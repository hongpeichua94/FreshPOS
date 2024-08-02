// const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: "localhost",
//   port: 5432,
//   database: "freshfruits",
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "dpg-cqm7973qf0us73a6h7r0-a",
  port: 5432,
  database: "freshfruits_database",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
