const Problem = require("../models/Problem");
const { successResponse } = require("../utils/apiResponse");
const createProblem = async (req, res,next) => {
  try {
    const {
      platform,
      problemId,
      title,
      url,
      difficulty,
      topics,
      status,
      notes,
    } = req.body;
    const problem = await Problem.create({
        userId : req.userId,
        platform,
            problemId,
            title,
            url,
            difficulty,
            topics,
            status,
            notes,
    });
    successResponse(
        res,
        "Problem created successfully",
        problem,
        201
    );
  } catch (e) {
    next(e);
  }
};

const getProblems = async(req,res,next)=>{
    try{
        const problems = (await Problem.find({userid:req.userid})).sort({createdAt:-1});
        console.log(problems);
        successResponse(
            res,
            "Problems fetched successfully",
            problems);
    }catch(e){
        next(e);
    }
}

const updateProblem = async(req,res,next)=>{
  try{
    const {problemId} = req.params;
    const {status,notes} = req.body;
    const problem = await Problem.findOneAndUpdate({problemId:problemId});
  }catch(e){
    console.log(e);
  }
}
module.exports = {createProblem,getProblems};