const connectDatabase = require("./src/config/database");
const User = require("./src/models/User");
const Problem = require("./src/models/Problem");
require("dotenv").config();
const testDatabase = async () => {
    try {
        await connectDatabase();

        const user = await User.create({
            name: "Test User",
            email: "test@example.com",
            password: "test123",
        });

        console.log("User created:", user._id);

        const problem = await Problem.create({
            userId: user._id,
            platform: "leetcode",
            problemId: "1",
            title: "Two Sum",
            url: "https://leetcode.com/problems/two-sum/",
            difficulty: "Easy",
            topics: ["Array", "Hash Table"],
            status: "not-started",
            notes: "Test problem",
        });

        console.log("Problem created:", problem._id);

        process.exit(0);
    } catch (error) {
        console.error("Database test failed:", error.message);
        process.exit(1);
    }
};

testDatabase();