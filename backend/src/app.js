require("dotenv").config();
require("./config/database");

const express = require("express");
const cors = require("cors");

const candidateRoutes = require("./routes/candidate.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/candidates", candidateRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;