import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

async function testGroq() {
    const key = process.env.GROQ_API_KEY;

    console.log("-----------------------------------------");
    console.log("🔍 TESTING GROQ API KEY...");

    if (!key) {
        console.error("❌ ERROR: GROQ_API_KEY is not set.");
        return;
    }

    const groq = new Groq({ apiKey: key });

    try {
        console.log("📡 Sending test request to Llama 3...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say 'Groq is ready!'" }
            ],
            model: "llama-3.1-8b-instant",
        });

        console.log("✅ SUCCESS!");
        console.log("Response:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("❌ GROQ API ERROR:", error.message);
    }

    console.log("-----------------------------------------");
}

testGroq();
