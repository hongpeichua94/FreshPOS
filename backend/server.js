require("dotenv").config();

const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const auth = require("./src/routers/auth");
const users = require("./src/routers/users");
const fruits = require("./src/routers/fruits");
const cart = require("./src/routers/cart");
const orders = require("./src/routers/orders");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/api", users);
app.use("/api", fruits);
app.use("/api", cart);
app.use("/api", orders);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
