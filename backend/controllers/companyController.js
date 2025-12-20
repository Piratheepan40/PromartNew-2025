import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userJSON = user.toJSON();
    userJSON._id = user.id;
    res.json(userJSON);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Update profile (email, phone, companyName)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, phone, companyName } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (companyName) user.companyName = companyName;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user.id,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    user.password = newPassword; // 🔹 Hook in User model will hash this
    user.passwordChangedAt = new Date();
    await user.save();

    res.json({
      message: "Password updated successfully. Please login again.",
      requiresReauth: true,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

