const app = require("./src/app");
// const env = require("./src/config/env");
require("dotenv").config();
const connectDatabase = require("./src/config/database");

const startServer = async () => {
    await connectDatabase();

    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
};

startServer();