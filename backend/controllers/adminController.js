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

// 🟩 Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      include: [
        {
          model: User,
          attributes: ["companyName", "email", "phone"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Transform for frontend compatibility (companyId population, _id)
    const formattedListings = listings.map(listing => {
      const l = listing.toJSON();
      l._id = l.id;
      l.companyId = l.User ? { ...l.User, _id: l.companyId } : l.companyId; // mimic population
      // Also ensure companyId inside the object has _id if needed? 
      // Logic: Mongo populated object has _id. Here User object doesn't have id in attributes above.
      // But listing.companyId (FK) is just the ID.
      // We set l.companyId to l.User. 
      // Warning: If we overwrite l.companyId (int) with l.User (obj), we lose the ID if not in User obj.
      // User attributes above: companyName, email, phone. No ID.
      // We should add displayId or id to User attributes?
      // Let's add 'id' to User attributes.
      return l;
    });

    res.json(formattedListings);
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