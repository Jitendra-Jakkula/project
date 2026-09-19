const Problem = require("../models/Problem");

const {
    successResponse,
    errorResponse,
} = require("../utils/apiResponse");


const createProblem = async (req, res, next) => {
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

        if (!platform || !problemId || !title) {
            return errorResponse(
                res,
                "Platform, problemId and title are required",
                400
            );
        }

        const problem = await Problem.create({
            userId: req.userId,
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
    } catch (error) {
        next(error);
    }
};


const getProblems = async (req, res, next) => {
    try {
        const problems = await Problem.find({
            userId: req.userId,
        }).sort({
            createdAt: -1,
        });

        successResponse(
            res,
            "Problems fetched successfully",
            problems
        );
    } catch (error) {
        next(error);
    }
};


const getProblem = async (req, res, next) => {
    try {
        const problem = await Problem.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!problem) {
            return errorResponse(
                res,
                "Problem not found",
                404
            );
        }

        successResponse(
            res,
            "Problem fetched successfully",
            problem
        );
    } catch (error) {
        next(error);
    }
};


const updateProblem = async (req, res, next) => {
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

        const problem = await Problem.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
            },
            {
                platform,
                problemId,
                title,
                url,
                difficulty,
                topics,
                status,
                notes,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!problem) {
            return errorResponse(
                res,
                "Problem not found",
                404
            );
        }

        successResponse(
            res,
            "Problem updated successfully",
            problem
        );
    } catch (error) {
        next(error);
    }
};


const deleteProblem = async (req, res, next) => {
    try {
        const problem = await Problem.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!problem) {
            return errorResponse(
                res,
                "Problem not found",
                404
            );
        }

        successResponse(
            res,
            "Problem deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createProblem,
    getProblems,
    getProblem,
    updateProblem,
    deleteProblem,
};