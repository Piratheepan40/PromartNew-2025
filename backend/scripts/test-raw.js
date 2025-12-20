import https from 'https';

async function testRawAPI() {
    const key = "AIzaSyCsUzFVxqII_LpXyPdg-6DIM9hjZaBRg8Q".trim();
    console.log("-----------------------------------------");
    console.log("🔍 TESTING API DIRECTLY (Raw HTTPS)");

    // Test gemini-1.5-flash
    const data = JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log("📡 Sending request to v1beta/gemini-1.5-flash...");

    const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            console.log(`📡 Status Code: ${res.statusCode}`);
            try {
                const json = JSON.parse(responseBody);
                if (res.statusCode === 200) {
                    console.log("✅ SUCCESS! Response:", json.candidates[0].content.parts[0].text);
                } else {
                    console.log("❌ FAILED:");
                    console.log(JSON.stringify(json, null, 2));

                    if (res.statusCode === 404) {
                        console.log("\n💡 ANALYSIS: 404 means the model wasn't found for this key.");
                        console.log("Possible causes:");
                        console.log("1. Your API key is restricted to a different project.");
                        console.log("2. Your region doesn't support Gemini 1.5 via API yet.");
                        console.log("3. You need to enable 'Generative Language API' in the Google Cloud project.");
                    }
                }
            } catch (e) {
                console.log("Raw Response:", responseBody);
            }
            console.log("-----------------------------------------");
        });
    });

    req.on('error', (error) => {
        console.error("❌ HTTPS ERROR:", error.message);
    });

    req.write(data);
    req.end();
}

testRawAPI();
