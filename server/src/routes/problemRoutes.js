const express  = require("express");
const { getProblems, createProblem,getProblem,updateProblem, deleteProblem } = require("../controllers/problemController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/",authMiddleware,getProblems);
router.post("/",authMiddleware,createProblem);
router.get("/:id", authMiddleware, getProblem);
router.put("/:id", authMiddleware, updateProblem);
router.delete("/:id", authMiddleware, deleteProblem);
module.exports = router;