const Order = require("../models/order");

const updateDeliveredOrders = async () => {
    try {
        const twoDaysAgo = new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
        );

        const result = await Order.updateMany(
            {
                paymentStatus: "captured",
                orderStatus: {
                    $in: [
                        "pending",
                        "processing",
                        "shipped"
                    ]
                },
                createdAt: {
                    $lte: twoDaysAgo
                }
            },
            {
                $set: {
                    orderStatus: "delivered"
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(
                `${result.modifiedCount} order(s) marked as delivered.`
            );
        }
    } catch (error) {
        console.error(
            "Failed to update order statuses:",
            error
        );
    }
};

module.exports = {
    updateDeliveredOrders
};