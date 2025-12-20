import Groq from "groq-sdk";
import asyncHandler from "express-async-handler";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * @desc    Get AI response for chatbot
 * @route   POST /api/ai/chat
 * @access  Public
 */
const getChatResponse = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    console.log("-----------------------------------------");
    console.log("📩 GROQ AI CHAT REQUEST");
    console.log("Message:", message);

    if (!process.env.GROQ_API_KEY) {
        console.error("❌ ERROR: GROQ_API_KEY is missing in .env");
        return res.status(503).json({
            message: "AI service is unavailable. Server missing Groq API key.",
        });
    }

    try {
        // Format history for Groq (OpenAI format)
        // role "model" in Gemini -> "assistant" in Groq
        const messages = [
            {
                role: "system",
                content: "You are the ProMart AI Assistant. ProMart is a B2B platform in Sri Lanka for company listings, manufacturing, and industrial services. Be professional, helpful, and concise."
            },
            ...(history || []).map(h => ({
                role: h.role === "model" ? "assistant" : h.role,
                content: h.parts[0].text
            })),
            {
                role: "user",
                content: message
            }
        ];

        console.log("🤖 Calling Groq API (Llama 3)...");
        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        const text = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        console.log("✅ Groq Response Success");
        res.json({ text });
    } catch (error) {
        console.error("❌ BACKEND GROQ ERROR:", error);
        res.status(500).json({
            message: "Groq AI Service Error",
            error: error.message,
        });
    }
});

/**
 * @desc    Optimize listing content
 * @route   POST /api/ai/optimize
 * @access  Private (Company)
 */
const optimizeListing = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    if (!process.env.GROQ_API_KEY) {
        return res.status(503).json({
            message: "AI service is currently unavailable. Please configure GROQ_API_KEY.",
        });
    }

    const prompt = `Optimize the following company listing for a B2B platform called ProMart.
  Category: ${category}
  Current Title: ${title}
  Current Description: ${description}
  
  Provide a more professional and SEO-friendly title and description. 
  Format your response as a JSON object with "title" and "description" fields.`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional B2B content optimizer. Return ONLY a valid JSON object."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content || "{}";
        const optimized = JSON.parse(text);
        res.json(optimized);
    } catch (error) {
        console.error("Groq Optimization Error:", error);
        res.status(500).json({ message: "Failed to optimize listing content" });
    }
});

export { getChatResponse, optimizeListing };
