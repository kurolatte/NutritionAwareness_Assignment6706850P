const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
    constructor(userId, username, email, passwordHash) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // Get all users (exclude passwords)
    static async getAllUsers() {
        let pool;
        try {
            pool = await sql.connect(dbConfig);
            const result = await pool.request().query("SELECT UserId, Username, Email FROM Users");
            return result.recordset;
        } catch (err) {
            console.error("Error fetching users:", err);
            throw err;
        } finally {
            if (pool) await pool.close();
        }
    }

    // Create a new user
    static async createUser(username, email, hashedPassword) {
        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool
                .request()
                .input("username", sql.VarChar, username.trim().toLowerCase())
                .input("email", sql.VarChar, email.trim().toLowerCase())
                .input("passwordHash", sql.VarChar, hashedPassword)
                .query(
                    "INSERT INTO Users (Username, Email, PasswordHash) OUTPUT INSERTED.UserId, INSERTED.Username, INSERTED.Email VALUES (@username, @email, @passwordHash)"
                );

            await pool.close();
            return result.recordset[0];
        } catch (err) {
            console.error("Error creating user:", err);
            throw err;
        }
    }

    // Get user by username (including hashed password for login)
    static async getUserByUsername(username) {
        let pool;
        try {
            pool = await sql.connect(dbConfig);
            const result = await pool
                .request()
                .input("username", sql.VarChar, username.trim().toLowerCase())
                .query("SELECT UserId, Username, Email, PasswordHash FROM Users WHERE LOWER(Username) = @username");

            if (result.recordset.length === 0) {
                return null; // User not found
            }

            const user = result.recordset[0];
            return new User(user.UserId, user.Username, user.Email, user.PasswordHash);
        } catch (err) {
            console.error("Error fetching user:", err);
            return null;
        } finally {
            if (pool) await pool.close();
        }
    }

    // Delete user by ID
    static async deleteUser(userId) {
        let pool;
        try {
            pool = await sql.connect(dbConfig);
            const result = await pool
                .request()
                .input("userId", sql.Int, userId)
                .query("DELETE FROM Users WHERE UserId = @userId");
    
            await pool.close();
    
            return result.rowsAffected[0] > 0; // Returns true if a row was deleted
        } catch (err) {
            console.error("Error deleting user:", err);
            throw err;
        }
    }
}

module.exports = User;
