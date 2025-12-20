console.log("Start Debug");
import dotenv from 'dotenv';
console.log("Dotenv imported");
dotenv.config();
console.log("Config loaded");

if (!process.env.JWT_SECRET) {
    console.log("No Secret");
} else {
    console.log("Secret Exists");
}
