IF DB_ID('NutritionAwarenessDB') IS NULL
    CREATE DATABASE NutritionAwarenessDB;
GO

USE NutritionAwarenessDB;
GO

IF OBJECT_ID('FoodItems', 'U') IS NOT NULL
    DROP TABLE FoodItems;

CREATE TABLE FoodItems (
    FoodItemId INT PRIMARY KEY IDENTITY(1,1),
    FoodName NVARCHAR(255) NOT NULL,
    NutritionalInfo NVARCHAR(MAX), -- e.g., Calories, Proteins, Carbs, Fats
    DietaryRestrictions NVARCHAR(MAX), -- Restrictions like "High Sodium", "Low Sugar", etc.
    AdditionalNotes NVARCHAR(MAX), -- Any extra information about the food
    CreatedAt DATETIME DEFAULT GETDATE()
);

IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    CreatedAt DATETIME DEFAULT GETDATE()
);

IF OBJECT_ID('UserFoodLogs', 'U') IS NOT NULL
    DROP TABLE UserFoodLogs;

CREATE TABLE UserFoodLogs (
    LogId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    FoodItemId INT FOREIGN KEY REFERENCES FoodItems(FoodItemId),
    Quantity INT NOT NULL,
    LoggedAt DATETIME DEFAULT GETDATE()
);
GO


--SELECT username, email, passwordHash FROM users;
--DELETE FROM Users WHERE Username = 'testing1';
--DBCC CHECKIDENT ('Users', RESEED, 0);
--SELECT * FROM UserFoodLogs;