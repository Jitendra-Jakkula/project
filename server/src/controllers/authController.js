const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const {
    successResponse,
    errorResponse,
} = require("../utils/apiResponse");
const register = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
    return errorResponse(
        res,
        "Name, email and password are required",
        400
    );
}
        const existingUser =  await User.findOne({email});
        if(existingUser){
            return errorResponse(res, "Email already registered", 409);
        }
        const hashPassword = await bcrypt.hash(password,12);
        const user = await User.create({
            name,
            email,
            password:hashPassword,
        });
        const token = generateToken(user._id);
        successResponse(
    res,
    "User registered successfully",
    {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    },
    201
);

    }catch(e){
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
    return errorResponse(
        res,
        "Email and password are required",
        400
    );
}

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return errorResponse(res, "Invalid email or password", 401);
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return errorResponse(res, "Invalid email or password", 401);
        }

        const token = generateToken(user._id);

        successResponse(
    res,
    "Login successful",
    {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token,
    }
);
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};

