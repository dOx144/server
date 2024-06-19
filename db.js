const { Pool } = require("pg");
// const { database } = require("pg/lib/defaults");

const pool = new Pool({
  user: "postgres",
  password: "postpassword2024",
  host: "localhost",
  port: 5432,
  database: "project",
});

module.exports = pool;
