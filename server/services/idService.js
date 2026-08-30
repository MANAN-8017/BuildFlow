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
    return generateId("order", "ORDER", 4);
};

const generateProductId = async () => {
    return generateId("product", "PRODUCT", 4);
}

const generateCartId = async () => {
    return generateId("cart", "CART", 3);
}

module.exports = { generateUserId, generateOrderId, generateProductId, generateCartId };