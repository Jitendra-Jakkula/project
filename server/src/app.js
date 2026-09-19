const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const app = express();
//Routes 
const healthRoutes = require("./routes/healthRoutes");
const problemRoutes = require("./routes/problemRoutes.js");
const problemDetectionRoutes = require("./routes/problemDetectionRoutes");
const cors = require("cors");
//why not cors()
app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }));
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/problems",problemRoutes);
app.use("/api", healthRoutes);
app.use("/api/problems/detect",problemDetectionRoutes);
app.use(errorHandler);
module.exports = app;