const sql = require("mssql");
const dbConfig = require("../dbConfig");

class UserFoodLog {
    constructor(logId, userId, foodItemId, quantity, loggedAt) {
        this.logId = logId;
        this.userId = userId;
        this.foodItemId = foodItemId;
        this.quantity = quantity;
        this.loggedAt = loggedAt;
    }

    // Get user's foodlogs from the db
    static async getUserFoodLogs(userId) {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool
                .request()
                .input("userId", sql.Int, userId)
                .query("SELECT * FROM UserFoodLogs WHERE UserId = @userId ORDER BY LoggedAt DESC");

            await pool.close();

            return result.recordset.map(log => new UserFoodLog(log.LogId, log.UserId, log.FoodItemId, log.Quantity, log.LoggedAt));
        } catch (err) {
            console.error("Error fetching food logs:", err);
            throw err;
        }
    }

    // Log food consumption
    static async logFoodConsumption(userId, foodItemId, quantity) {
        try {
            if (!foodItemId || !quantity || quantity <= 0) {
                throw new Error("Invalid food item or quantity");
            }

            const pool = await sql.connect(dbConfig);
            const result = await pool
                .request()
                .input("userId", sql.Int, userId)
                .input("foodItemId", sql.Int, foodItemId)
                .input("quantity", sql.Int, quantity)
                .input("loggedAt", sql.DateTime, new Date())
                .query(
                    "INSERT INTO UserFoodLogs (UserId, FoodItemId, Quantity, LoggedAt) OUTPUT INSERTED.* VALUES (@userId, @foodItemId, @quantity, @loggedAt)"
                );

            await pool.close();
            return result.recordset[0]; // Return newly inserted foodlog
        } catch (err) {
            console.error("Error logging food consumption:", err);
            throw err;
        }
    }
}

module.exports = UserFoodLog;
