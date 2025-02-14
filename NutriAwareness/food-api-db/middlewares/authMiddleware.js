const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    console.log("Incoming Headers:", req.headers); // Log all headers

    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided or invalid format." });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token); // Debugging log

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.status(403).json({ message: "Invalid token." });
        }

        console.log("Decoded JWT Payload:", user); // Debugging log
        req.user = user; // Attach user data to request
        next();
    });
};

module.exports = authenticateToken;
