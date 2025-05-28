require("dotenv").config();
const app = require("./src/app/app");
const databaseConnection = require("./src/db/database");

// Run DB connection once at cold start
databaseConnection();

// Export the app for Vercel to use as a serverless function
module.exports = app;
