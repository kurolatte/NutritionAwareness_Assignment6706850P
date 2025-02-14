const UserFoodLog = require("../models/userFoodLogs");

const getUserFoodLogs = async (req, res) => {
    try {
        console.log("User from JWT:", req.user); // Debugging log
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: "User ID missing from request." });
        }

        const logs = await UserFoodLog.getUserFoodLogs(req.user.userId);
        if (!logs || logs.length === 0) {
            return res.status(404).json({ message: "No food logs found for the user." });
        }

        res.json(logs);
    } catch (error) {
        console.error("Error fetching user food logs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logFoodConsumption = async (req, res) => {
    try {
        const { foodItemId, quantity } = req.body;

        // Validate input
        if (!foodItemId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid input. Provide foodItemId and a positive quantity." });
        }

        const newLog = await UserFoodLog.logFoodConsumption(
            req.user.userId, foodItemId, quantity
        );

        res.status(201).json({
            message: "Food consumption logged successfully",
            foodLog: newLog
        });
    } catch (error) {
        console.error("Error logging food consumption:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getUserFoodLogs, 
    logFoodConsumption 
};
