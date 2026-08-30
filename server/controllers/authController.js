const User = require("../models/user");
const { generateUserId } = require("../services/idService");
const { generateToken } = require("../services/authService");
const { validateName, validateEmail, validatePhone, validatePassword, validateUserPassword, hashPassword } = require("../services/validationService");

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.status(500).json({ success: false, message: "Couldn't find user" });
        }

        const validPassword = await validateUserPassword(password, user.password);

        if(!validPassword.success){
            return res.status(201).json({ success: true, message: validPassword.message });
        }

        const token = generateToken(user);

        return res.status(200).json({ success: true, message: "Login successful", token: token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error){
        return res.status(500).json({ success: false, message: "Failed to login user" });
    }
}

const register = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        const validations = [
            validateName(name),
            validateEmail(email),
            validatePhone(phone),
            validatePassword(password)
        ];

        for (const validation of validations) {
            if (!validation.success) {
                throw new Error(validation.message);
            }
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const hashPass = await hashPassword(password);
        const userId = await generateUserId();

        const user = await User.create({
            userId,
            name: name,
            email: email,
            phone: phone,
            password: hashPass,
            address: address,
            isLogin: true
        });

        return res.status(201).json({ success: true, message: "User registered sucessfully",
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
         });
    } catch (error){
        return res.status(500).json({ success: false, message: error.message });
    }
}

const me = async (req, res) => {
    try {
        const user = await User.findOne({
            userId: req.user.userId
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

module.exports = { login, register, me };