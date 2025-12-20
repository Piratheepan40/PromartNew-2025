import express from "express";
const router = express.Router();
import { getChatResponse, optimizeListing } from "../controllers/aiController.js";

// Public chat route
router.post("/chat", getChatResponse);

// Optimization route (placeholder for auth if needed)
router.post("/optimize", optimizeListing);

export default router;
