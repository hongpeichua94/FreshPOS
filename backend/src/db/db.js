const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: "localhost",
//   port: 5432,
//   database: "freshfruits",
// });

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
