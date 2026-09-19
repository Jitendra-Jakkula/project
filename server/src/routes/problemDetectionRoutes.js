const express = require("express");

const {
    detectProblem,
} = require("../controllers/problemDetectionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    detectProblem
);

module.exports = router;