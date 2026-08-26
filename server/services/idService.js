const Counter = require("../models/counter");

const generateId = async (entity, prefix, digits) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: entity },
        { $inc: { sequence: 1 } },
        {
            returnDocument: "after",
            upsert: true
        }
    );

    const sequenceNumber = counter.sequence
        .toString()
        .padStart(digits, "0");

    return `${prefix}-${sequenceNumber}`;
};

const generateUserId = async () => {
    return generateId("user", "USER", 3);
};

const generateOrderId = async () => {
    return generateId("order", "BF-ORD", 4);
};

module.exports = { generateUserId, generateOrderId };