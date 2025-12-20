import axios from "axios";

const API_URL = "http://localhost:5000/api";

const verifyPhase1 = async () => {
    console.log("🚀 Starting Phase 1 Verification...");

    try {
        // 1. Test Public Inquiry Submission
        console.log("\n1. Testing Inquiry Submission...");
        const inquiryData = {
            listingId: 1, // Assumes a listing with ID 1 exists
            name: "Test Lead",
            email: "lead@example.com",
            phone: "1234567890",
            subject: "Interested in your services",
            message: "This is a test inquiry message."
        };

        const res = await axios.post(`${API_URL}/inquiries`, inquiryData);
        if (res.status === 201) {
            console.log("✅ Inquiry submitted successfully!");
        } else {
            console.log("❌ Inquiry submission failed:", res.status);
        }

        // Since we don't have a reliable company token here without manual login, 
        // we'll stop the automated part here.
        console.log("\nNext Steps for Manual Verification:");
        console.log("1. Log in as a Company.");
        console.log("2. Navigate to Dashboard -> Leads.");
        console.log("3. Verify 'Test Lead' appears in the list.");
        console.log("4. Click on the lead and mark as 'Responded'.");

    } catch (error) {
        if (error.response?.status === 404) {
            console.log("⚠️ Listing ID 1 not found. Please ensure a listing exists in the DB for a full test.");
        } else {
            console.error("❌ Verification failed:", error.message);
        }
    }
};

verifyPhase1();
