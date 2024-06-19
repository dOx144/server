const express = require("express");
const cors = require("cors");
const app = express();

const pool = require("./db");

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/userdata", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM userdata");

    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await pool.query("SELECT * FROM users WHERE user_id=$1", [
      user_id,
    ]);
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/userdata/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await pool.query("SELECT * FROM userdata WHERE user_id = $1", [
      user_id,
    ]);
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/dataitems", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM dataitems");

    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/dataitems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await pool.query(
      "SELECT * FROM dataitems WHERE user_title=$1",
      [id]
    );
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/userdata", async (req, res) => {
  try {
    const {
      user_id,
      user_title,
      user_note,
      user_total,
      user_expense,
      user_saved,
    } = req.body;

    const insertData = await pool.query(
      "INSERT INTO userdata(user_id,user_title,user_note,user_total,user_expense,user_saved) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [user_id, user_title, user_note, user_total, user_expense, user_saved]
    );
    res.json({ message: "Item Added!" });
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/users", async (req, res) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      user_email,
      confirmPass,
      user_agree,
    } = req.body;

    const newUser = await pool.query(
      "INSERT INTO users (user_id, first_name, last_name, user_email, confirmPass, user_agree) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, first_name, last_name, user_email, confirmPass, user_agree]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/dataitems", async (req, res) => {
  try {
    const { user_title, item_name, item_price } = req.body;
    const insertData = await pool.query(
      "INSERT INTO dataitems(user_title,item_name,item_price) VALUES ($1,$2,$3)",
      [user_title, item_name, item_price]
    );
    res.json({ message: "Item Added!" });
  } catch (err) {
    console.error(err.message);
  }
});
// app.post("/users", async (req, res) => {
//   try {
//     const {
//       user_id,
//       first_name,
//       last_name,
//       user_email,
//       confirmPass,
//       user_agree,
//     } = req.body;

//     const newUser = await pool.query(
//       "INSERT INTO users (user_id, first_name, last_name, user_email, confirmPass, user_agree) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
//       [user_id, first_name, last_name, user_email, confirmPass, user_agree]
//     );

//     res.json(newUser.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.delete("/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params; // Corrected destructuring to match the route parameter name
    const deleteUser = await pool.query(
      "DELETE FROM users WHERE user_id = $1", // Parameterized query to prevent SQL injection
      [user_id]
    );

    if (deleteUser.rowCount === 0) {
      // Handle case where no rows were deleted (e.g., invalid fruit_id)
      return res.status(404).json({ error: "id not found" });
    }

    // res.json({ message: `Fruit with ID ${id} is deleted` });
    res.json("Row deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" }); // Send an error response to the client
  }
});

app.delete("/userdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUserdata = await pool.query(
      "DELETE FROM userdata where user_title = $1 ",
      [id]
    );

    res.json({ message: "Delete SuccessFully" });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server is Running ");
});
