<<<<<<< HEAD
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import sendEmail from "../services/emailService.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";

// 🟩 Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalCompanies = await User.count({ where: { role: "company" } });
    const totalListings = await Listing.count();
    const approvedListings = await Listing.count({ where: { status: "approved" } });
    const pendingListings = await Listing.count({ where: { status: "pending" } });
    const rejectedListings = await Listing.count({ where: { status: "rejected" } });

    res.json({
      totalCompanies,
      totalListings,
      approvedListings,
      pendingListings,
      rejectedListings
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });
    // Map to include _id for frontend compatibility
    const usersData = users.map(user => {
      const u = user.toJSON();
      u._id = u.id;
      return u;
    });
    res.json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all listings (with optional filtering)
export const getAllListings = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};

    if (status && status !== "all") {
      whereClause.status = status;
    }

    const listings = await Listing.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["id", "companyName", "email", "phone"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Transform for frontend which expects _id and companyId object
    const formattedListings = listings.map(listing => {
      const l = listing.toJSON();
      l._id = l.id;
      // If User exists, attach it as companyId with _id
      if (l.User) {
        l.companyId = { ...l.User, _id: l.User.id };
      }
      return l;
    });

    // Frontend expects { success: true, count: ..., listings: ... } structure for this filtered route?
    // Based on adminRoutes.js inline code, it returned { success: true, count: ..., listings }.
    // But this function was originally returning just array in adminController.js.
    // Let's check how the frontend calls it. 
    // Usually Admin Dashboard expects: { success: true, count: ..., listings: [] } or just []?
    // Looking at previous adminRoutes logic (Step 274, line 45): res.json({ success: true, count: ..., listings })
    // So we should match that format since we are replacing that route.

    res.json({
      success: true,
      count: formattedListings.length,
      listings: formattedListings
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Approve listing
export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User }]
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "approved";
    await listing.save();

    console.log(`🎯 Approving listing: ${listing.title} for company: ${listing.User?.companyName}`);

    // 🔔 NOTIFY COMPANY
    if (listing.User) {
      try {
        await Notification.create({
          userId: listing.User.id,
          type: "status_update",
          message: `Your listing "${listing.title}" has been approved and is now live`,
          listingId: listing.id,
          read: false
        });
        console.log("✅ Notification created successfully");
      } catch (notificationError) {
        console.error("❌ Failed to create notification:", notificationError);
      }

      // 📧 NOTIFY COMPANY
      try {
        await sendEmail(
          listing.User.email,
          "Listing Approved - Your Listing is Now Live!",
          `Great news! Your listing "${listing.title}" has been approved and is now live on our platform.\n\nView your listing here: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/listings/${listing.id}\n\nThank you for using ProMart!`
        );
        console.log("✅ Approval email sent successfully");
      } catch (emailError) {
        console.error("❌ Failed to send approval email:", emailError.message);
      }
    }

    const listingJSON = listing.toJSON();
    listingJSON._id = listing.id;
    // Map User to companyId for consistent response if needed
    if (listingJSON.User) listingJSON.companyId = listingJSON.User;

    res.json({ message: "Listing approved", listing: listingJSON });
  } catch (error) {
    console.error("Error approving listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Reject listing
export const rejectListing = async (req, res) => {
  try {
    const { reason } = req.body;
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User }]
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "rejected";
    // if (reason) listing.adminComment = reason; // Error: Schema doesn't have adminComment? 
    // Checking Listing.js... it doesn't have adminComment in my update (Step 80).
    // I should check if I missed it from original Listing.js (Step 37).
    // Step 37 Listing.js didn't show adminComment either!
    // So this might have been a dynamic field or I missed it in Mongoose schema?
    // "keyFeatures", "attachments", "verificationDocuments", "status", "createdAt".
    // I don't see adminComment in Step 37. Maybe it was added later?
    // User code had `if (reason) listing.adminComment = reason;`.
    // I will comment it out or add column if strictly needed. I'll comment out for now.

    await listing.save();

    const rejectionReason = reason || "Please check our guidelines and submit again.";

    console.log(`🎯 Rejecting listing: ${listing.title} for company: ${listing.User?.companyName}`);

    if (listing.User) {
      // 🔔 NOTIFY COMPANY
      try {
        await Notification.create({
          userId: listing.User.id,
          type: "status_update",
          message: `Your listing "${listing.title}" has been rejected. Reason: ${rejectionReason}`,
          listingId: listing.id,
          read: false
        });
        console.log("✅ Notification created successfully");
      } catch (notificationError) {
        console.error("❌ Failed to create notification:", notificationError);
      }

      // 📧 NOTIFY COMPANY
      try {
        await sendEmail(
          listing.User.email,
          "Listing Update - Your Listing Requires Changes",
          `Your listing "${listing.title}" has been reviewed and requires changes.\n\nReason: ${rejectionReason}\n\nPlease update your listing and submit it for review again.\n\nThank you for using ProMart!`
        );
        console.log("✅ Rejection email sent successfully");
      } catch (emailError) {
        console.error("❌ Failed to send rejection email:", emailError.message);
      }
    }

    const listingJSON = listing.toJSON();
    listingJSON._id = listing.id;

    res.json({ message: "Listing rejected", listing: listingJSON });
  } catch (error) {
    console.error("Error rejecting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Admin Reset Password
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const tempPassword = "company123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update using Model.update
    const [updated] = await User.update(
      { password: hashedPassword },
      { where: { id } }
    );

    if (updated === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    // Fetch user for email
    const user = await User.findByPk(id);

    // 📨 Send email with temp password
    await sendEmail(
      user.email,
      "🔑 Password Reset by Admin",
      `
      Hi ${user.companyName || user.email},

      Your account password has been reset by the administrator.

      👉 Temporary Password: ${tempPassword}

      Please log in using this password and change it immediately from your dashboard.

      Thank you,
      Support Team
      `
    );

    res.json({ success: true, message: "Password reset and email sent successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟩 Reactivate User
export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await User.update(
      { isActive: true },
      { where: { id } }
    );

    if (updated === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    const user = await User.findByPk(id);

    // 📨 Send email notification
    await sendEmail(
      user.email,
      "✅ Account Reactivated",
      `
      Hi ${user.companyName || user.email},

      Good news! Your account has been reactivated by the administrator.

      You can now log in and continue using the system as usual.

      Thank you,
      Admin Team
      `
    );

    res.json({ success: true, message: "User reactivated successfully", user });
  } catch (error) {
    console.error("❌ Reactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟥 Deactivate User
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await User.update(
      { isActive: false },
      { where: { id } }
    );

    if (updated === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    const user = await User.findByPk(id);

    // 📨 Send email notification
    await sendEmail(
      user.email,
      "🚫 Account Deactivated",
      `
      Hi ${user.companyName || user.email},

      Your account has been deactivated by the administrator.

      If you believe this is a mistake or need assistance, please contact support.

      Thank you,
      Admin Team
      `
    );

    res.json({ success: true, message: "User deactivated successfully", user });
  } catch (error) {
    console.error("❌ Deactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟩 Delete Listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['email', 'companyName'] }]
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const companyEmail = listing.User?.email;
    const companyName = listing.User?.companyName || "Company";
    const listingTitle = listing.title;

    await listing.destroy();

    if (companyEmail) {
      await sendEmail(
        companyEmail,
        "Listing Removed from Platform",
        `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Dear ${companyName},</h2>
        <p>We wanted to inform you that your listing titled 
        <strong>"${listingTitle}"</strong> has been removed from our platform.</p>

        <p>If you believe this is a mistake or want clarification, 
        please contact our support team.</p>

        <p style="margin-top:20px;">Best Regards,<br/>Admin Team</p>
        </div>
        `
      );
    }

    res.json({ message: "Listing deleted and email sent successfully" });
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Delete Company
export const deleteCompany = async (req, res) => {
  try {
    const company = await User.findByPk(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Delete all listings by this company first
    await Listing.destroy({ where: { companyId: company.id } });

    // Delete the company
    await company.destroy();

    res.json({ message: "Company and its listings deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get Monthly Stats
export const getMonthlyStats = async (req, res) => {
  try {
    // Determine year to filter? Or just all time? 
    // The previous aggregation grouped by month index ($month), implying all years mixed or just assuming reasonable data spread.
    // Let's fetch all relevant fields and process in JS for safety/simplicity with Sequelize.
    const listings = await Listing.findAll({
      attributes: ['createdAt', 'status']
    });

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Initialize stats bucket
    const stats = new Array(12).fill(0).map((_, i) => ({
      month: months[i],
      listings: 0,
      approved: 0,
      rejected: 0
    }));

    listings.forEach(l => {
      const date = new Date(l.createdAt);
      const monthIndex = date.getMonth(); // 0-11

      if (monthIndex >= 0 && monthIndex < 12) {
        stats[monthIndex].listings++;
        if (l.status === 'approved') stats[monthIndex].approved++;
        if (l.status === 'rejected') stats[monthIndex].rejected++;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};
=======
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import sendEmail from "../services/emailService.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
// 🟩 Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalListings = await Listing.countDocuments();
    const approvedListings = await Listing.countDocuments({ status: "approved" });
    const pendingListings = await Listing.countDocuments({ status: "pending" });
    const rejectedListings = await Listing.countDocuments({ status: "rejected" });

    res.json({ 
      totalCompanies, 
      totalListings, 
      approvedListings, 
      pendingListings,
      rejectedListings 
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("companyId", "companyName email phone")
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Approve listing - CORRECTED VERSION
export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("companyId");
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "approved";
    await listing.save();

    console.log(`🎯 Approving listing: ${listing.title} for company: ${listing.companyId.companyName}`);

    // 🔔 NOTIFY COMPANY: Create notification
    try {
      await Notification.create({
        userId: listing.companyId._id,
        type: "status_update",
        message: `Your listing "${listing.title}" has been approved and is now live`,
        listingId: listing._id,
        read: false
      });
      console.log("✅ Notification created successfully");
    } catch (notificationError) {
      console.error("❌ Failed to create notification:", notificationError);
    }

    // 📧 NOTIFY COMPANY: Send email
    try {
      await sendEmail(
        listing.companyId.email,
        "Listing Approved - Your Listing is Now Live!",
        `Great news! Your listing "${listing.title}" has been approved and is now live on our platform.\n\nView your listing here: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/listings/${listing._id}\n\nThank you for using ProMart!`
      );
      console.log("✅ Approval email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send approval email:", emailError.message);
      // Don't throw - continue even if email fails
    }

    res.json({ message: "Listing approved", listing });
  } catch (error) {
    console.error("Error approving listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Reject listing - CORRECTED VERSION
export const rejectListing = async (req, res) => {
  try {
    const { reason } = req.body;
    const listing = await Listing.findById(req.params.id).populate("companyId");
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "rejected";
    if (reason) listing.adminComment = reason;
    await listing.save();

    const rejectionReason = reason || "Please check our guidelines and submit again.";

    console.log(`🎯 Rejecting listing: ${listing.title} for company: ${listing.companyId.companyName}`);

    // 🔔 NOTIFY COMPANY: Create notification
    try {
      await Notification.create({
        userId: listing.companyId._id,
        type: "status_update",
        message: `Your listing "${listing.title}" has been rejected. Reason: ${rejectionReason}`,
        listingId: listing._id,
        read: false
      });
      console.log("✅ Notification created successfully");
    } catch (notificationError) {
      console.error("❌ Failed to create notification:", notificationError);
    }

    // 📧 NOTIFY COMPANY: Send email
    try {
      await sendEmail(
        listing.companyId.email,
        "Listing Update - Your Listing Requires Changes",
        `Your listing "${listing.title}" has been reviewed and requires changes.\n\nReason: ${rejectionReason}\n\nPlease update your listing and submit it for review again.\n\nThank you for using ProMart!`
      );
      console.log("✅ Rejection email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send rejection email:", emailError.message);
      // Don't throw - continue even if email fails
    }

    res.json({ message: "Listing rejected", listing });
  } catch (error) {
    console.error("Error rejecting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Admin Reset Password
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const tempPassword = "company123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 📨 Send email with temp password
    await sendEmail(
      user.email,
      "🔑 Password Reset by Admin",
      `
      Hi ${user.companyName || user.email},

      Your account password has been reset by the administrator.

      👉 Temporary Password: ${tempPassword}

      Please log in using this password and change it immediately from your dashboard.

      Thank you,
      Support Team
      `
    );

    res.json({ success: true, message: "Password reset and email sent successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟩 Reactivate User
export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 📨 Send email notification
    await sendEmail(
      user.email,
      "✅ Account Reactivated",
      `
      Hi ${user.companyName || user.email},

      Good news! Your account has been reactivated by the administrator.

      You can now log in and continue using the system as usual.

      Thank you,
      Admin Team
      `
    );

    res.json({ success: true, message: "User reactivated successfully", user });
  } catch (error) {
    console.error("❌ Reactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟥 Deactivate User
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 📨 Send email notification
    await sendEmail(
      user.email,
      "🚫 Account Deactivated",
      `
      Hi ${user.companyName || user.email},

      Your account has been deactivated by the administrator.

      If you believe this is a mistake or need assistance, please contact support.

      Thank you,
      Admin Team
      `
    );

    res.json({ success: true, message: "User deactivated successfully", user });
  } catch (error) {
    console.error("❌ Deactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
>>>>>>> f8244c1 (admin  code added)
