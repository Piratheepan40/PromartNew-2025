import Inquiry from "../models/Inquiry.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import sendEmail from "../services/emailService.js";

/**
 * @desc    Send a new inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
export const createInquiry = async (req, res) => {
    try {
        const { listingId, name, email, phone, subject, message } = req.body;

        const listing = await Listing.findByPk(listingId, {
            include: [{ model: User, attributes: ["email", "companyName"] }]
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const inquiry = await Inquiry.create({
            companyId: listing.companyId,
            listingId,
            name,
            email,
            phone,
            subject,
            message,
        });

        // 📧 Send email to company
        if (listing.User && listing.User.email) {
            await sendEmail(
                listing.User.email,
                `New Inquiry: ${subject}`,
                `You have a new inquiry from ${name} (${email}).\n\nListing: ${listing.title}\nMessage:\n${message}\n\nPlease log in to your dashboard to view more details.`
            ).catch(err => console.error("Failed to send inquiry email:", err));
        }

        res.status(201).json({
            success: true,
            data: inquiry,
            message: "Inquiry sent successfully!",
        });
    } catch (error) {
        console.error("Create Inquiry Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc    Get all inquiries for a company
 * @route   GET /api/inquiries/my
 * @access  Private (Company)
 */
export const getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            where: { companyId: req.user.id },
            include: [
                {
                    model: Listing,
                    as: "listing",
                    attributes: ["title", "category"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            data: inquiries,
        });
    } catch (error) {
        console.error("Get My Inquiries Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc    Update inquiry status
 * @route   PATCH /api/inquiries/:id
 * @access  Private (Company)
 */
export const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByPk(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }

        // Check if inquiry belongs to the company
        if (inquiry.companyId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this inquiry" });
        }

        inquiry.status = status;
        await inquiry.save();

        res.status(200).json({
            success: true,
            data: inquiry,
        });
    } catch (error) {
        console.error("Update Inquiry Status Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
