const bcrypt = require("bcryptjs");

const validateName = (name) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return false;
    }
    const nameRegex = /^[A-Za-z' ']+$/;
    const isValid = nameRegex.test(trimmedName);
    return { success: isValid, message: isValid ? "Valid name" : "Invalid name" };
};

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isValid = emailRegex.test(email.trim());
    return { success: isValid, message: isValid ? "Valid email" : "Invalid email" };
};

const validatePhone = (phone) => {
    const phoneRegex = /^(?:\+91[- ]?)?[6-9]\d{9}$/;
    const isValid = phoneRegex.test(phone.trim());
    return { success: isValid, message: isValid ? "Valid phone number" : "Invalid phone number" };
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const validatePassword = (password) => {
    if (password.length < 4) {
        return { success: false, message: "Password must be at least 4 characters" };
    }
    return { success: true, message: "Valid password" };
};

const validateUserPassword = async (password, hashPass) => {
    const isValid = await bcrypt.compare( password, hashPass );
    return { success: isValid, message: isValid ?  "Correct password" : "Incorrect password" };
};

module.exports = { validateName, validateEmail, validatePhone, hashPassword, validatePassword, validateUserPassword };