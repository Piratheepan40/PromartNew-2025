import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import sendEmail from "../services/emailService.js";

// 🟩 Create new listing (with file uploads)
export const createListing = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🖼️ Handle uploaded files
    const attachments = req.files?.attachments
      ? req.files.attachments.map((file) => ({
        name: file.originalname,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        type: file.mimetype,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }))
      : [];

    const verificationDocuments = req.files?.verificationDocuments
      ? req.files.verificationDocuments.map((file) => ({
        name: file.originalname,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        type: file.mimetype,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }))
      : [];

    // 🏗️ Create new listing
    const listing = await Listing.create({
      companyId: user.id,
      companyName: user.companyName,
      email: user.email,
      phone: user.phone,
      ...req.body,
      attachments, // Sequelize JSON handles array
      verificationDocuments,
      status: "pending",
    });

    // 🔔 NOTIFY ADMIN: Create notification for all admins
    const admins = await User.findAll({ where: { role: "admin" } });

    const adminNotificationPromises = admins.map(admin =>
      Notification.create({
        userId: admin.id,
        type: "new_listing",
        message: `New listing "${listing.title}" submitted by ${user.companyName} for approval`,
        listingId: listing.id,
        read: false
      })
    );

    // 📧 NOTIFY ADMIN: Send email to all admins
    const adminEmailPromises = admins.map(admin =>
      sendEmail(
        admin.email,
        "New Listing Submission - Requires Approval",
        `A new listing "${listing.title}" has been submitted by ${user.companyName} and is pending your approval.\n\nListing Details:\n- Title: ${listing.title}\n- Category: ${listing.category}\n- Company: ${user.companyName}\n\nPlease review it in the admin dashboard.`
      ).catch(error => console.error("Failed to send email to admin:", error))
    );

    await Promise.all([...adminNotificationPromises, ...adminEmailPromises]);

    // Return JSON with _id alias
    const listingJSON = listing.toJSON();
    listingJSON._id = listing.id;

    res.status(201).json(listingJSON);
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all approved listings (public)
export const getApprovedListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { status: "approved" },
      include: [{ model: User, attributes: ["companyName", "email", "phone"] }]
    });

    const formattedListings = listings.map(l => {
      const json = l.toJSON();
      json._id = l.id;
      // Map user to companyId format (if frontend expects object)
      if (json.User) {
        json.companyId = { ...json.User, _id: l.companyId };
      }
      return json;
    });

    res.json(formattedListings);
  } catch (error) {
    console.error("Error fetching approved listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get listings of logged-in company
export const getCompanyListings = async (req, res) => {
  const listings = await Listing.findAll({ where: { companyId: req.user.id } });
  const formattedListings = listings.map(l => {
    const json = l.toJSON();
    json._id = l.id;
    return json;
  });
  res.json(formattedListings);
};

// ✅ Update Listing (company can edit) - FIXED VERSION
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // 🧾 Only company who owns this listing can update it
    if (listing.companyId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🧱 Parse existing files from request body with metadata
    let existingAttachments = [];
    let existingVerificationDocuments = [];

    try {
      if (req.body.existingAttachments) {
        existingAttachments =
          typeof req.body.existingAttachments === "string"
            ? JSON.parse(req.body.existingAttachments)
            : req.body.existingAttachments;
      }

      if (req.body.existingVerificationDocuments) {
        existingVerificationDocuments =
          typeof req.body.existingVerificationDocuments === "string"
            ? JSON.parse(req.body.existingVerificationDocuments)
            : req.body.existingVerificationDocuments;
      }
    } catch (parseError) {
      console.error("Error parsing existing files:", parseError);
      // Fallback to current listing files if parsing fails
      // Note: listing.attachments is already JSON/array from Sequelize
      existingAttachments = listing.attachments || [];
      existingVerificationDocuments = listing.verificationDocuments || [];
    }

    // 🖼️ Handle new uploaded files with proper metadata
    const newAttachments = req.files?.attachments
      ? req.files.attachments.map((file) => ({
        name: file.originalname,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        type: file.mimetype,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }))
      : [];

    const newVerificationDocs = req.files?.verificationDocuments
      ? req.files.verificationDocuments.map((file) => ({
        name: file.originalname,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        type: file.mimetype,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }))
      : [];

    // ✅ Merge existing (with preserved metadata) + new files
    // Ensure existing is array
    if (!Array.isArray(existingAttachments)) existingAttachments = [];
    if (!Array.isArray(existingVerificationDocuments)) existingVerificationDocuments = [];

    listing.attachments = [...existingAttachments, ...newAttachments];
    listing.verificationDocuments = [
      ...existingVerificationDocuments,
      ...newVerificationDocs,
    ];

    // 🧱 Update text fields
    listing.title = req.body.title || listing.title;
    listing.description = req.body.description || listing.description;
    listing.category = req.body.category || listing.category;
    listing.location = req.body.location || listing.location;
    listing.website = req.body.website || listing.website;

    // Parse keyFeatures if it's a string
    if (req.body.keyFeatures) {
      try {
        listing.keyFeatures =
          typeof req.body.keyFeatures === "string"
            ? JSON.parse(req.body.keyFeatures)
            : req.body.keyFeatures;
      } catch (error) {
        console.error("Error parsing keyFeatures:", error);
        listing.keyFeatures = req.body.keyFeatures;
      }
    }

    // 🔁 Set status back to pending (needs re-approval)
    listing.status = "pending";
    await listing.save();

    // 🔔 NOTIFY ADMIN: Create notification for re-approval
    const admins = await User.findAll({ where: { role: "admin" } });
    const user = await User.findByPk(req.user.id);

    const reapprovalNotificationPromises = admins.map(admin =>
      Notification.create({
        userId: admin.id,
        type: "re_approval",
        message: `Listing "${listing.title}" updated by ${user.companyName} and requires re-approval`,
        listingId: listing.id,
        read: false
      })
    );

    // 📧 NOTIFY ADMIN: Send email for re-approval
    const reapprovalEmailPromises = admins.map(admin =>
      sendEmail(
        admin.email,
        "Listing Updated - Requires Re-approval",
        `The listing "${listing.title}" has been updated by ${user.companyName} and requires your re-approval.\n\nPlease review the changes in the admin dashboard.`
      ).catch(error => console.error("Failed to send email to admin:", error))
    );

    await Promise.all([...reapprovalNotificationPromises, ...reapprovalEmailPromises]);

    const listingJSON = listing.toJSON();
    listingJSON._id = listing.id;

    res.json({
      message: "Listing updated and pending admin approval",
      listing: listingJSON,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};