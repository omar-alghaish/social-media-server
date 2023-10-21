import crypto from "crypto";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import restPasswordTmp from "../templates/restPassword.js";

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

export const singup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profileImg: req.body.profileImg
  });

  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!user || !isCorrectPassword) {
    return next(new ApiError("Incorrect email or password"));
  }

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

// make sure the user is logged in
export const protect = asyncHandler(async (req, res, next) => {
  // check if token exists in headers
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Extract token from the authorization header
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("You are not logged in", 401));
  }

  try {
    // verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError("The user belonging to this token does not exist", 401));
    }

    // check if user changed his password after the token was issued
    if (currentUser.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (passwordChangedTimestamp > decoded.iat) {
        return next(new ApiError("User recently changed his password. Please login again.", 401));
      }
    }

    // Attach the user object to the request for further middleware to use
    req.user = currentUser;
    next();
  } catch (error) {
    // Handle token verification errors (expired token, invalid signature, etc.)
    return next(new ApiError("Invalid token. Please login again.", 401));
  }
});

export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

export const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) if user exist, generate hash random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save password reset code into db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  // 3) send the reset code via email
  const message = `Hi ${user.name},\n we received a request ot rest password on your accout. \n ${resetCode} \n thanks for helping us keep your account secure `;

  try {
     sendEmail({
      email: user.email,
      subject: "password reset code",
      message,
      html: restPasswordTmp({ code: resetCode, name: user.name }),
    });

  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) get user based on reset code

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  //2) reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("There is no user for this email"));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified"));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) generate token

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});
