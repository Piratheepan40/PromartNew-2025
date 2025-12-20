import express from "express";
import {
    createInquiry,
    getMyInquiries,
    updateInquiryStatus,
} from "../controllers/inquiryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route to send an inquiry
router.post("/", createInquiry);

// Private routes for companies to manage their inquiries
router.get("/my", protect, getMyInquiries);
router.patch("/:id", protect, updateInquiryStatus);

export default router;
