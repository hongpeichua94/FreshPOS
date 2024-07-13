const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  try {
    // Check if the email already exists
    const authEmail = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);

    if (authEmail.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", msg: "Email already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(req.body.password, 12);

    // Insert the new user into the users table
    const newUser = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [req.body.email, hash]
    );

    res.json({ status: "ok", msg: "User created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Invalid registration" });
  }
};

const login = async (req, res) => {
  try {
    const auth = await db.query("SELECT * FROM users WHERE email = $1", [
      req.body.email,
    ]);
    if (auth.rows.length === 0) {
      return res
        .status(400)
        .json({ status: "error", msg: "Invalid email or password" });
    }

    const user = auth.rows[0];
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      console.error("Invalid email or password");
      return res.status(401).json({ status: "error", msg: "Login failed" });
    }

    const claims = {
      email: user.email,
      role: user.role,
      loggedInId: user.uuid,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh, user_id: user.uuid });
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)

      .json({ status: "error", msg: "Catch Caught: Login failed" });
  }
};

const refresh = (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const claims = {
      email: decoded.email,
      role: decoded.role,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refreshing token failed" });
  }
};

module.exports = { register, login, refresh };
