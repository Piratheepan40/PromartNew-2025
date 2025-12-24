import Contact from "../models/Contact.js";
import sendEmail from "../services/emailService.js";

// 🟩 Create contact message
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newContact = await Contact.create({ name, email, subject, message });

    // 📧 Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      await sendEmail(
        adminEmail,
        `📩 New Contact Message: ${subject}`,
        `You have a new message from ${name} (${email}):\n\n${message}`
      ).catch(error => console.error("Failed to send admin email:", error));
    }

    // 📧 Send confirmation email to user
    await sendEmail(
      email,
      `We received your message: ${subject}`,
      `Hi ${name},\n\nThank you for contacting us. We have received your message and will get back to you shortly.\n\nYour Message:\n${message}\n\nBest regards,\nThe ProMart Team`
    ).catch(error => console.error("Failed to send user confirmation email:", error));

    res.status(201).json({
      success: true,
      message: "Message received successfully!",
      contact: newContact,
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all contact messages (for admin)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// 🟩 Delete contact message (for admin)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.destroy({ where: { id } });
    if (deleted === 0)
      return res.status(404).json({ success: false, message: "Message not found" });

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("❌ Delete contact error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟩 Update contact status (for admin)
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const [updated] = await Contact.update(
      { status },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    const contact = await Contact.findByPk(id);

    res.json({ success: true, message: "Status updated", contact });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
