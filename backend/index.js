const authRoutes = require("./routes/authRoutes");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
