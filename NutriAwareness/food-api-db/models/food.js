const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Food {
  constructor(foodItemId, foodName, nutritionalInfo, dietaryRestrictions, additionalNotes) {
    this.foodItemId = foodItemId;
    this.foodName = foodName;
    this.nutritionalInfo = nutritionalInfo;
    this.dietaryRestrictions = dietaryRestrictions;
    this.additionalNotes = additionalNotes;
  }

  // Get all food items
  static async getAllFoodItems() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM FoodItems`; // Replace with your actual table name
    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) =>
        new Food(
          row.FoodItemId,
          row.FoodName,
          row.NutritionalInfo,
          row.DietaryRestrictions,
          row.AdditionalNotes
        )
    );
  }

  // Get a food item by ID
  static async getFoodItemById(foodItemId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM FoodItems WHERE FoodItemId = @foodItemId`; // Parameterized query
    const request = connection.request();
    request.input("foodItemId", sql.Int, foodItemId); // Specify data type
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Food(
          result.recordset[0].FoodItemId,
          result.recordset[0].FoodName,
          result.recordset[0].NutritionalInfo,
          result.recordset[0].DietaryRestrictions,
          result.recordset[0].AdditionalNotes
        )
      : null; // Handle food item not found
  }
}

module.exports = Food;
