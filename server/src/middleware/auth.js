import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Reads the Bearer token, verifies it, and loads the user onto req.user.
// This matches src/api/axios.js on the frontend, which attaches
// `Authorization: Bearer <token>` to every request automatically.
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Frontend's axios interceptor treats any 401 as "session expired"
    // and boots the user back to /login — this is what triggers that.
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Not authorized, user no longer exists");
  }

  req.user = user;
  next();
});

// Use after `protect` on routes only admins should hit
export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }
  next();
}
