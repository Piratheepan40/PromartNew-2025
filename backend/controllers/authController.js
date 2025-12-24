import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { companyName, email, phone, password, role } = req.body; // ✅ added phone

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user
    const user = await User.create({
      companyName,
      email,
      phone, // ✅ added phone here
      password,
      role: role || "company",
      verified: true,
    });

    // Return response
    res.status(201).json({
      _id: user.id, // Keeping _id alias for frontend compatibility
      companyName: user.companyName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken({ id: user.id, role: user.role }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Optional safety fix
  if (!user.passwordChangedAt) {
    user.passwordChangedAt = new Date();
    await user.save();
  }
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: "Your account has been deactivated. Please contact support.",
    });
  }


  res.json({
    _id: user.id, // Keeping _id alias for frontend compatibility
    companyName: user.companyName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    token: generateToken({ id: user.id, role: user.role }),
  });
};
