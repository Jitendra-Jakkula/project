const express = require("express");
const { successResponse } = require("../utils/apiResponse");

const router = express.Router();

router.get("/health", (req, res) => {
    
    successResponse(res, "Server is running");
});

module.exports = router;