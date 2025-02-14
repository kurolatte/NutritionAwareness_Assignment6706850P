const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET; 

// Updated Registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username already exists
        if (await User.getUserByUsername(username)) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password during registration:", hashedPassword); // Debugging log

        // Create the user with the hashed password
        await User.createUser(username, email, hashedPassword);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Updated Login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve user from the database based on username
        const user = await User.getUserByUsername(username);

        // If the user is not found
        if (!user) {
            console.log("User not found"); // Debugging log
            return res.status(401).json({ message: "Invalid username or password" });
        }
        console.log("User found:", user); // Debugging log

        // Compare the entered password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log("Password comparison result:", isPasswordValid); // Debugging log

        // If the password is invalid
        if (!isPasswordValid) {
            console.log("Invalid password"); // Debugging log
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // If the password is valid, generate a JWT token
        const token = jwt.sign(
            { userId: user.userId, username: user.username },
            secretKey,
            { expiresIn: "1h" }
        );

        console.log("Login successful, token generated"); // Debugging log

        // Send token back in the response
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { 
    login, 
    register 
};
