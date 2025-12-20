import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testModels() {
    // Using the new key provided by the user for verification
    const key = "AIzaSyCsUzFVxqII_LpXyPdg-6DIM9hjZaBRg8Q";
    console.log("-----------------------------------------");
    console.log("🔍 Testing the NEW Gemini API Key...");
    const genAI = new GoogleGenerativeAI(key);

    // List of common model names to test
    const modelsToTest = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of modelsToTest) {
        console.log(`\n📡 Testing: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'Ready'");
            const response = await result.response;
            console.log(`✅ SUCCESS! ${modelName} responded: ${response.text()}`);
        } catch (error) {
            console.error(`❌ ${modelName} failed:`, error.message);
        }
    }
    console.log("\n💡 If all models failed with 404, please double-check your API key at https://aistudio.google.com/app/apikey");
    console.log("-----------------------------------------");
}

testModels();
