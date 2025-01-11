module.exports = {
    user: "FoodNutri_User", // Replace with your SQL Server login username
    password: "FoodNutri_User", // Replace with your SQL Server login password
    server: "localhost",
    database: "NutritionAwarenessDB",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };

