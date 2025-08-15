// import jwt from 'jsonwebtoken';
// import { Session } from '../models/Session.model.js';
// export const isAuthenticated = async (req, res, next) => {
//   try {
//     let token =req.cookies?.token || req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized, token missing" });
//     }
//     const existingSession = await Session.findOne({ token }).populate("userId");

//   if (!existingSession) {
//     return res.status(401).json({ message: "Unauthorized, invalid token " });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded || !decoded.id ) {
//       return res.status(401).json({ message: "Unauthorized, invalid token decoded" });
//     }
// const session = await Session.findOne({ userId: decoded.id, token });
//     if (!session) {
//       return res.status(403).json({ message: "Token is invalid or revoked" });
//     }  
//    req.user = existingSession.userId
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized, user not found" });
//     }

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token invalid or expired" });
//   }
// };


import jwt from "jsonwebtoken";
import { Session } from "../models/Session.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // 1. Get token from cookie or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    // 2. Verify JWT first (fast check)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized, token invalid or expired" });
    }

    if (!decoded?.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized, invalid token payload" });
    }

    // 3. Find session in one DB call
    const session = await Session.findOne({
      userId: decoded.id,
      token,
    }).populate("userId");

    if (!session) {
      return res
        .status(403)
        .json({ message: "Token is invalid or revoked" });
    }

    // 4. Attach user to request
    req.user = session.userId;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
