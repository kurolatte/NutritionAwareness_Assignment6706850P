const Food = require("../models/food");

// Get all food items
const getAllFoodItems = async (req, res) => {
    try {
        const foodItems = await Food.getAllFoodItems();
        res.status(200).json(foodItems);
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single food item by ID
const getFoodItemById = async (req, res) => {
    try {
        const foodItem = await Food.getFoodItemById(parseInt(req.params.id));
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.status(200).json(foodItem);
    } catch (error) {
        console.error("Error fetching food item:", error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new food item
const createFoodItem = async (req, res) => {
    try {
        const { foodName, nutritionalInfo, dietaryRestrictions, suitableForElderly, additionalNotes } = req.body;

        // Validate required fields
        if (!foodName || !nutritionalInfo) {
            return res.status(400).json({ message: "Food name and nutritional info are required" });
        }

        // Ensure that no field is missing
        const newFood = await Food.createFoodItem(foodName, nutritionalInfo, dietaryRestrictions, suitableForElderly, additionalNotes);
        res.status(201).json({ message: "Food item created successfully", foodItem: newFood });
    } catch (error) {
        console.error("Error creating food item:", error);
        res.status(500).json({ message: error.message });
    }
};


// Update food item suitability for elderly 
const updateFoodItemElderlyStatus = async (req, res) => {
    try {
        const updatedFood = await Food.updateFoodItemElderlyStatus(
            parseInt(req.params.id),
            req.body.suitableForElderly
        );
        res.status(200).json({ message: "Food item updated successfully", foodItem: updatedFood });
    } catch (error) {
        console.error("Error updating food item:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a food item
const deleteFoodItem = async (req, res) => {
    try {
        await Food.deleteFoodItem(parseInt(req.params.id));
        res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error("Error deleting food item:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllFoodItems,
    getFoodItemById,
    createFoodItem,
    updateFoodItemElderlyStatus,
    deleteFoodItem
};
