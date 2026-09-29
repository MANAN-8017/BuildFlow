require("dotenv").config();
require("./config/db")();
const { updateDeliveredOrders } = require("./services/orderStatusService");

updateDeliveredOrders();

setInterval(updateDeliveredOrders, 60*60*1000);

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