import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Session } from '../models/Session.model.js';
export const isAuthenticated = async (req, res, next) => {
  try {
   
    let token =req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }
    const existingSession = await Session.findOne({ token }).populate("userId");

  if (!existingSession) {
    return res.status(401).json({ message: "Unauthorized, invalid token " });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id ) {
      return res.status(401).json({ message: "Unauthorized, invalid token decoded" });
    }

    // Check if session exists

const session = await Session.findOne({ userId: decoded.id, token });
    if (!session) {
      return res.status(403).json({ message: "Token is invalid or revoked" });
    }
    
req.user = existingSession.userId
   

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
