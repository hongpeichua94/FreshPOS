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

const corsOptions = {
  origin: [
    "https://fresh-pos.vercel.app",
    "https://freshpos-production.up.railway.app",
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/api", users);
app.use("/api", fruits);
app.use("/api", cart);
app.use("/api", orders);

app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
