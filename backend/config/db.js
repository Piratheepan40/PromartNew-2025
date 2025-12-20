import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Debugging DB Config:");
console.log("DB_NAME:", process.env.DB_NAME, "DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_USER:", process.env.DB_USER, "DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_HOST:", process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME || process.env.DB_DATABASE,
  process.env.DB_USER || process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || process.env.DB_CONNECTION || "mysql",
    logging: console.log, // Enable logging to debug if needed
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST}`);
    // Sync models
    // await sequelize.sync(); // We will call this in server.js or explicitly
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, connectDB };
