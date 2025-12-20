// middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.warn("⚠️ Auth Failed: No token provided in headers");
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.warn(`⚠️ Auth Failed: User not found for ID ${decoded.id}`);
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        console.warn("⚠️ Auth Failed: Password changed recently");
        return res.status(401).json({
          message: 'Password was recently changed. Please login again.'
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
  }
};

// 🧩 Restrict route to admin users only
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};
