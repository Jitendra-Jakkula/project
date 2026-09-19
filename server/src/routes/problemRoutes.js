const express  = require("express");
const { getProblems, createProblem } = require("../controllers/problemController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/",authMiddleware,getProblems);
router.post("/",authMiddleware,createProblem);
module.exports = router;