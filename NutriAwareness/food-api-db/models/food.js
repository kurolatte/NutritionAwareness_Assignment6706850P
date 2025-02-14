const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Food {
  constructor(foodItemId, foodName, nutritionalInfo, dietaryRestrictions, suitableForElderly, additionalNotes) {
    this.foodItemId = foodItemId;
    this.foodName = foodName;
    this.nutritionalInfo = nutritionalInfo;
    this.dietaryRestrictions = dietaryRestrictions;
    this.suitableForElderly = suitableForElderly;
    this.additionalNotes = additionalNotes;
  }

  // Get all food items from the database
  static async getAllFoodItems() {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query("SELECT * FROM FoodItems");
      await pool.close();

      return result.recordset.map(food => new Food(
        food.FoodItemId,
        food.FoodName,
        food.NutritionalInfo,
        food.DietaryRestrictions,
        food.SuitableForElderly,
        food.AdditionalNotes
      ));
    } catch (err) {
      console.error("Error fetching food items:", err);
      throw err;
    }
  }

  // Get a single food item by ID
  static async getFoodItemById(foodItemId) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("foodItemId", sql.Int, foodItemId)
        .query("SELECT * FROM FoodItems WHERE FoodItemId = @foodItemId");

      await pool.close();

      if (result.recordset.length === 0) return null;
      const food = result.recordset[0];

      return new Food(food.FoodItemId, food.FoodName, food.NutritionalInfo, food.DietaryRestrictions, food.SuitableForElderly, food.AdditionalNotes);
    } catch (err) {
      console.error("Error fetching food item:", err);
      return null;
    }
  }

  // Create a new food item
  static async createFoodItem(foodName, nutritionalInfo, dietaryRestrictions, suitableForElderly, additionalNotes) {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("foodName", sql.VarChar, foodName)
            .input("nutritionalInfo", sql.VarChar, nutritionalInfo)
            .input("dietaryRestrictions", sql.VarChar, dietaryRestrictions || null)
            .input("suitableForElderly", sql.Bit, suitableForElderly ?? false) // Default to false if undefined
            .input("additionalNotes", sql.VarChar, additionalNotes || null)
            .query(`
                INSERT INTO FoodItems (FoodName, NutritionalInfo, DietaryRestrictions, SuitableForElderly, AdditionalNotes)
                OUTPUT INSERTED.*
                VALUES (@foodName, @nutritionalInfo, @dietaryRestrictions, @suitableForElderly, @additionalNotes)
            `);

        return result.recordset[0];
    } catch (err) {
        console.error("Error creating food item:", err);
        throw err;
    }
}

  // Update food item suitability for elderly
  static async updateFoodItemElderlyStatus(foodItemId, suitableForElderly) {
    try {
      const pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("foodItemId", sql.Int, foodItemId)
        .input("suitableForElderly", sql.Bit, suitableForElderly)
        .query("UPDATE FoodItems SET SuitableForElderly = @suitableForElderly WHERE FoodItemId = @foodItemId");

      await pool.close();
      return { foodItemId, suitableForElderly };
    } catch (err) {
      console.error("Error updating food item:", err);
      throw err;
    }
  }

  // Delete a food item
  static async deleteFoodItem(foodItemId) {
    try {
      const pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("foodItemId", sql.Int, foodItemId)
        .query("DELETE FROM FoodItems WHERE FoodItemId = @foodItemId");

      await pool.close();
      return { message: "Food item deleted successfully" };
    } catch (err) {
      console.error("Error deleting food item:", err);
      throw err;
    }
  }
}

module.exports = Food;
