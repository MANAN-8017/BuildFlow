require("dotenv").config();
require("./config/db")();

const app = require("./app");

const PORT = process.env.PORT;

try {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
catch (error) {
    console.error("Error starting the server:", error);
}