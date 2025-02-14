const express = require('express');
const router = express.Router();
const foodLogController = require("../controllers/foodLogController");
const authenticateToken = require("../middleware/authenticateToken");
const UserFoodLog = require('../models/UserFoodLog');

router.get('/foodlogs/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        // Use the method from the UserFoodLog class to fetch food logs
        const foodLogs = await UserFoodLog.getUserFoodLogs(userId);

        if (foodLogs.length === 0) {
            return res.status(404).json({ message: "No food logs found for this user" });
        }

        res.json(foodLogs);
    } catch (error) {
        console.error('Error fetching food log:', error);
        res.status(500).json({ message: "Error fetching food log" });
    }
});

router.get('/', (req, res) => {
    res.send('User route is working');
});

router.get("/user-food-logs", authenticateToken, foodLogController.getUserFoodLogs);


module.exports = router;
