import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/auth/register
// Matches AuthContext.jsx's register(name, email, password)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are all required");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("An account with that email already exists");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: user.toPublicJSON(),
  });
});

// POST /api/auth/login
// Matches AuthContext.jsx's login(email, password)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  // password has `select: false` on the schema, so it must be requested explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  res.json({
    token,
    user: user.toPublicJSON(),
  });
});

// GET /api/auth/me
// Handy for checking a stored token is still valid without a full login
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});
