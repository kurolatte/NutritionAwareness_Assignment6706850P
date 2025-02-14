const User = require("../models/user");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

// Get user by username
const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    let { id } = req.params;
    
    // Ensure ID is an integer
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    
    id = parseInt(id);  // Convert to integer
    
    try {
        const deleted = await User.deleteUser(id);
        if (deleted) {
            return res.status(200).json({ message: "User deleted successfully" });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("SQL Error:", error);
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
};

// This function fetches a user by username from the database
const findUserByUsername = async (username) => {
    return User.findOne({ username: username });  // Assuming `username` is a unique field
};


module.exports = { 
    getAllUsers, 
    getUserByUsername,
    deleteUser,
    findUserByUsername
};
