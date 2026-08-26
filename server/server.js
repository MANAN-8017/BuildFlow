require("dotenv").config();
require("./config/db")();

const app = require("./app");

const PORT = process.env.PORT;

try {
    app.get("/", (req, res) => {
    res.json({
        message: "BuildFlow API is running"
    });
});
}
catch (error) {
    console.error("Error starting the server:", error);
}