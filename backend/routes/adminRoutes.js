<<<<<<< HEAD
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
=======
import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getDashboardStats,
  getAllCompanies,
  approveListing,
  rejectListing,
  deactivateUser,
  reactivateUser,
  resetUserPassword 

} from "../controllers/adminController.js";

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
router.get("/listings", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    const listings = await Listing.find(filter)
      .populate("companyId", "companyName email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});

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
router.delete("/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//
// ✅ 7. Delete Company (and its listings)
//
router.delete("/companies/:id", async (req, res) => {
  try {
    const company = await User.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    await Listing.deleteMany({ companyId: company._id });
    await company.deleteOne();

    res.json({ message: "Company and its listings deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Monthly Listing Stats
router.get("/listings/monthly", async (req, res) => {
  try {
    const stats = await Listing.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          listings: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const chartData = stats.map((s) => ({
      month: months[s._id - 1],
      listings: s.listings,
      approved: s.approved,
      rejected: s.rejected,
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/reset-password/:id", resetUserPassword);
router.patch("/reactivate/:id", reactivateUser);
router.patch("/deactivate/:id", deactivateUser);
export default router;
>>>>>>> f8244c1 (admin  code added)
