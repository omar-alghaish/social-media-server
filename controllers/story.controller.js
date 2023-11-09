import Story from "../models/story.model.js";
import asyncHandler from "express-async-handler";

export const createStory = asyncHandler(async (req, res, next) => {
  const { content, expiresInDays } = req.body;
  const mediaFiles = req.files;
  const mentions = content.match(/@\w+/g);
  const hashtags = content.match(/#\w+/g);

  const expiresInMilliseconds = expiresInDays * 24 * 60 * 60 * 1000;
  const expires_at = new Date(Date.now() + expiresInMilliseconds);

  const story = await Story.create({
    user: req.user._id,
    userName: req.user.name,
    userProfile: req.user.profileImgUrl,
    content,
    media: mediaFiles,
    mentions,
    hashtags,
    expires_at,
  });
  res.status(200).json({ data: story });
});

export const getFriendsStories = asyncHandler(async (req, res, next) => {
  const friends = req.user.friends;
  const friendStories = await Story.find({ user: { $in: friends } }).sort({
    created_at: -1,
  });
  res.status(200).json({ data: friendStories });
});

export const getStoriesById = asyncHandler(async (req, res, next) => {
  const stories = await Story.find({ user: req.body.id }).sort({
    created_at: -1,
  });
  res.status(200).json({ data: stories });
});

export const deleteStory = asyncHandler(async (req, res, next) => {
  const story = await Story.find({ user: req.user._id, _id: req.body.id });
  res.status(200).json({ message: "story deleted" });
});
