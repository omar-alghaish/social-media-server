import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

export const createStory = asyncHandler(async (req, res, next) => {
  const { content, expiresInDays, objects } = req.body;
  const mediaFiles = req.files;
  const mentions = content?.match(/@\w+/g);
  const hashtags = content?.match(/#\w+/g);

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
    objects: JSON.parse(objects),
  });
  res.status(200).json({ data: story });
});

export const getFriendsStories = asyncHandler(async (req, res, next) => {
  const friends = req.user.friends;

  // Create an array to store the results
  const friendsStories = [];

  // Iterate through the user's friends and fetch their active stories along with name and profileImgUrl
  for (const friendId of friends) {
    // Find friend's information (name and profileImgUrl) from the User model
    const friendInfo = await User.findById(friendId, "name profileImgUrl");

    // Find friend's active stories
    const friendStories = await Story.find({
      user: friendId,
      isActive: true,
    });

    // If the friend has active stories, add their info and stories to the result array
    if (friendStories.length > 0) {
      friendsStories.push({
        friendId: friendId,
        name: friendInfo.name,
        profileImgUrl: friendInfo.profileImgUrl,
        stories: friendStories,
      });
    }
  }

  res.status(200).json({ data: friendsStories });
});

export const getStoriesById = asyncHandler(async (req, res, next) => {
  const stories = await Story.find({ user: req.body.id }).sort({
    created_at: -1,
  });
  res.status(200).json({ data: stories });
});

export const deleteStory = asyncHandler(async (req, res, next) => {
  const story = await Story.findOneAndDelete({
    user: req.user._id,
    _id: req.body.id,
  });
  res.status(200).json({ message: "story deleted" });
});

export const updateStory = asyncHandler(async (req, res, next) => {});
