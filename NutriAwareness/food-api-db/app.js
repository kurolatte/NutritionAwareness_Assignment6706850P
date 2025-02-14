const express = require("express");
const bodyParser = require("body-parser");
const foodController = require("./controllers/foodController");
const authController = require("./controllers/authController");
const foodLogController = require("./controllers/foodLogController");
const authenticateToken = require("./middlewares/authMiddleware");
const validateFood = require("./middlewares/validateFood");
const userController = require('./controllers/userController');
require("dotenv").config();

const app = express();
const port = process.env.DB_PORT;
const path = require('path');
const cors = require("cors");

app.use(cors());


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication Routes
app.post("/login", authController.login);
app.post("/register", authController.register);

// Food Routes 
app.get("/fooditems", foodController.getAllFoodItems);
app.get("/fooditems/:id", foodController.getFoodItemById);
app.post("/fooditems", validateFood, foodController.createFoodItem);
app.put("/fooditems/:id", foodController.updateFoodItemElderlyStatus);
app.delete("/fooditems/:id", foodController.deleteFoodItem);

// Food Log Routes with authentication
app.get("/foodlogs", authenticateToken, foodLogController.getUserFoodLogs);
app.post("/foodlogs", authenticateToken, foodLogController.logFoodConsumption);

// User Routes
app.get("/users/:username", userController.getUserByUsername);
app.get("/users", userController.getAllUsers);
app.delete("/users/:id", userController.deleteUser);

// Get food log by user ID
app.get('/foodlogs/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
          .input('userId', sql.Int, userId)
          .query(`
              SELECT f.FoodName, l.Quantity, l.LoggedAt
              FROM UserFoodLogs l
              JOIN FoodItems f ON l.FoodItemId = f.FoodItemId
              WHERE l.UserId = @userId
          `);

      if (result.recordset.length === 0) {
          return res.status(404).json({ message: "No food logs found for this user" });
      }

      res.json(result.recordset);  // Send back the food logs
  } catch (error) {
      console.error('Error fetching food log:', error);
      res.status(500).json({ message: "Error fetching food log" });
  }
});


// css
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});