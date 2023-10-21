import sharp from "sharp";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { createOne, deleteOne, getAll, getOne } from "./handlerFactory.js";
import ApiError from "../utils/apiError.js";

export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${Date.now()}.jpeg`;
console.log(req.body)
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImg = filename;
  }
  next();
});

export const createUser = createOne(User);

export const getUsers = getAll(User);

export const getUser = getOne(User);

export const deleteUser = deleteOne(User);

export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No ${User} for this id ${req.params.id}`), 404);
  }
  res.status(200).json({ data: document });
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No ${Model} for this id ${req.params.id}`), 404);
  }
  res.status(200).json({ data: document });
});

export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

export const deActivate = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});

export const activate = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: true });

  res.status(204).json({ status: "Success" });
});
