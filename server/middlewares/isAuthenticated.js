import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    let token =req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
