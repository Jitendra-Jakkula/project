const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const healthRoutes = require("./routes/healthRoutes");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api", healthRoutes);

app.use(errorHandler);
module.exports = app;