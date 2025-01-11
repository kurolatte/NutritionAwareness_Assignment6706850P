const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 9000;

app.listen(port, async () => {
    try {
          await sql.connect(dbConfig);
          console.log("Database connection established successfully");
        } catch (err) {
          console.error("Database connection error:", err);
          process.exit(1);
        }
      
        console.log(`Server listening on port ${port}`);
  });

  // Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
