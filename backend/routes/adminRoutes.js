import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getDashboardStats,
  getAllCompanies,
  getAllListings,
  approveListing,
  rejectListing,
  getMonthlyStats,
  deleteListing,
  deleteCompany,
  deactivateUser,
  reactivateUser,
  resetUserPassword,
} from "../controllers/adminController.js";
import sendEmail from "../services/emailService.js";

const router = express.Router();

// 🧱 Middleware — only admins can access
router.use(protect, adminOnly);

//
// ✅ 1. Dashboard Summary
//
router.get("/stats", getDashboardStats);

// ✅ 2. Get All Companies
router.get("/companies", getAllCompanies);

//
// ✅ 3. Get All Listings (with company info)
//
router.get("/listings", getAllListings);

//
// ✅ 4. Approve Listing (using controller function)
//
router.put("/listings/:id/approved", approveListing);

//
// ✅ 5. Reject Listing (using controller function)
//
router.put("/listings/:id/reject", rejectListing);

//
// ✅ 6. Delete Listing
//
router.delete("/listings/:id", deleteListing);

//
// ✅ 7. Delete Company (and its listings)
//
router.delete("/companies/:id", deleteCompany);

// ✅ Get Monthly Listing Stats
router.get("/listings/monthly", getMonthlyStats);

router.patch("/reset-password/:id", resetUserPassword);
router.patch("/reactivate/:id", reactivateUser);
router.patch("/deactivate/:id", deactivateUser);
export default router;
