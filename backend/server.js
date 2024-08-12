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

// To limit number of API calls
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutues
  max: 100, // each IP can make up to 100 requests per 'window' (ie. 15m)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
