const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const token = jwt.sign(
        {
            userId: user.userId,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
    console.log("Token generated at service: ", token);
    return token;
};

module.exports = { generateToken };