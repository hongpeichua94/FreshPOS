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
  host: "dpg-cqm7o2o8fa8c73cd17i0-a.singapore-postgres.render.com",
  port: 5432,
  database: "freshfruits_database_geik",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
