const Razorpay = require("razorpay");
const crypto = require("crypto");

const create = async (req) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = Number(req.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Invalid payment amount.");
        }

        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise,
            currency: req.currency || "INR",
            receipt: req.receipt
        };

        console.log("Payment amount:", amount);
        console.log("Razorpay amount in paise:", amountInPaise);

        const order = await instance.orders.create(options);

        console.log("Razorpay order created:", order);

        return order;
    } catch (error) {
        console.error("Razorpay full error:", error);

        throw new Error(
            `Error creating payment: ${
                error.message || JSON.stringify(error)
            }`
        );
    }
};

const verify = (
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const payload =
        razorpayOrderId +
        "|" +
        razorpayPaymentId;

    const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    console.log("Order ID:", razorpayOrderId);
    console.log("Payment ID:", razorpayPaymentId);
    console.log("Received:", razorpaySignature);
    console.log("Generated:", generated_signature);
    console.log(
        "Payload:",
        payload
    );
    console.log(
        "Match:",
        generated_signature === razorpaySignature
    );

    return generated_signature === razorpaySignature;
};

module.exports = {
    create,
    verify
};