const Counter = require("../models/counter");

const generateOrderId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { _id: "order" },
        { $inc: { sequence: 1 } },
        {
            new: true,
            upsert: true
        }
    );

    const sequenceNumber = counter.sequence
        .toString()
        .padStart(6, "0");

    return `BF-ORD-${sequenceNumber}`;
};

module.exports = generateOrderId;