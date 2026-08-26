const Razorpay = require("razorpay");

const create = async (req) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        
        const options = {
            amount: req.amount * 100,
            currency: req.currency,
            receipt: req.receipt
        };

        const order = await instance.orders.create(options);
        return order;
    } catch (error) {
        throw new Error(`Error creating payment: ${error.message}`);
    }
};

const verify = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const crypto = require("crypto");
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    return generated_signature === razorpay_signature;
}

module.exports = { create , verify};