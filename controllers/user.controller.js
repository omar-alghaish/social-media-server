import sharp from "sharp";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { createOne, deleteOne, getAll, getOne } from "./handlerFactory.js";
import ApiError from "../utils/apiError.js";

export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${Date.now()}.jpeg`;
  console.log(req.body);
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

export const getInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id) .populate({
    path: 'friendsRequest',
    select: 'profileImg name',
  })
  


  if (!user) {
    return next(new ApiError("user not found"));
  }

  res.status(200).json(user);
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

export const addFriend = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const userToBeFriend = await User.findById(id);
  if (userToBeFriend.friendsRequest.includes(req.user._id)) {
    return next(new ApiError("you are already send request"));
  }
  userToBeFriend.friendsRequest.push(req.user._id);
  userToBeFriend.followers.push(req.user._id);
  await userToBeFriend.save();
  res.status(200).json({ message: "friend request sent" });
});

export const acceptFriend = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const userSendRequest = await User.findById(id);
  const user = await User.findById(req.user._id);

  userSendRequest.friends.push(req.user._id);
  user.friends.push(id);
  let index = user.friendsRequest.indexOf(userSendRequest);
  user.friendsRequest.splice(index, 1);

  await user.save();
  await userSendRequest.save();
  res.status(200).json({ message: "accepted" });
});

export const follow = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const userToBoFollowed = await User.findById(id);

  const user = await User.findById(req.user._id);
  if (userToBoFollowed.followers.includes(req.user._id)) {
    let index = userToBoFollowed.followers.indexOf(req.user._id);
    userToBoFollowed.followers.splice(index, 1);

    let index2 = user.following.indexOf(id);
    user.following.splice(index2, 1);
  } else {
    userToBoFollowed.followers.push(req.user._id);
    user.following.push(id);
  }

  await userToBoFollowed.save();
  await user.save();

  res.status(200).json({message:"success"})
});
