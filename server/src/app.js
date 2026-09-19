const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();
//Routes 
const healthRoutes = require("./routes/healthRoutes");
const problemRoutes = require("./routes/problemRoutes.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/problems",problemRoutes);
app.use("/api", healthRoutes);

app.use(errorHandler);
module.exports = app;