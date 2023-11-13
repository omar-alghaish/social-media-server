import Post from "../models/post.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import notification from "../models/notifications.model.js";
import { getOne } from "./handlerFactory.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const mediaFiles = req.files;
  const { content } = req.body;
  const mentions = content.match(/@\w+/g);
  const hashtags = content.match(/#\w+/g);

  const newPost = await Post.create({
    user: req.user.id,
    userProfile: req.user.profileImgUrl,
    userName: req.user.name,
    content: content,
    media: mediaFiles,
    mentions,
    hashtags,
  });
  res.status(200).json({ data: newPost });
});

export const getUserPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const posts = await Post.find({ user: id });
  res.status(200).json({ data: posts });
});

export const likePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.body;
  const post = await Post.findById(postId);
  if (post.likes.includes(req.user._id)) {
    let index = post.likes.indexOf(req.user._id);
    if (index !== -1) {
      post.likes.splice(index, 1);
    }
  } else {
    post.likes.push(req.user._id);
    await notification.create({
      user: post.user,
      from: req.user._id,
      title: "love",
      type: 1,
      text: `${req.user.name} love you post`,
      read: false,
    });
  }
  await post.save();
  res.status(200).json({ data: post.likes });
});

export const makeComment = asyncHandler(async (req, res, next) => {
  const { postId, text } = req.body;
  const user = req.user;
  const post = await Post.findById(postId);
  post.comments.push({
    userId: user._id,
    userProfile: user.profileImgUrl,
    text,
    userName: user.name,
  });

  await post.save();
  res.status(200).json({ data: post.comments });
});

export const getFriendsPosts = asyncHandler(async (req, res, next) => {
  const friends = req.user.friends;
  const documentsCounts = await Post.countDocuments();

  if (friends.length === 0) {
    return next(new ApiError("please make some friends", 400));
  }
  const apiFeatures = new ApiFeatures(
    Post.find({ user: { $in: friends } }),
    req.query
  )
    .filter()
    .sort()
    .paginate(documentsCounts)
    .search();

  const { mongooseQuery, pagination } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, pagination, data: documents });
});

export const getPostsByHashtag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  const documentsCounts = await Post.countDocuments();

  const apiFeatures = new ApiFeatures(
    Post.find({ hashtags: `#${tag}` }),
    req.query
  )
    .filter()
    .paginate(documentsCounts)
    .search()
    .sort({ createdAt: -1 });

  const { mongooseQuery, pagination } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, pagination, data: documents });
});

export const reactPost = asyncHandler(async (req, res, next) => {
  const { reactionType } = req.body;
  const postId = req.params.postId;
  const userId = req.user._id;

  const validReactions = [
    "like",
    "love",
    "haha",
    "wow",
    "sad",
    "angry",
    "lying",
    "partying",
  ];
  if (!validReactions.includes(reactionType)) {
    return res.status(400).json({ error: "Invalid reaction type" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // Check if the user has already made this reaction
  const userReactionIndex = post.reactions[reactionType].users.indexOf(userId);
  const userAlreadyReacted = userReactionIndex !== -1;

  // Remove the previous reaction, if any
  validReactions.forEach((reaction) => {
    if (reaction !== reactionType) {
      const index = post.reactions[reaction].users.indexOf(userId);
      if (index !== -1) {
        post.reactions[reaction].users.splice(index, 1);
        post.reactions[reaction].count--;
      }
    }
  });

  if (userAlreadyReacted) {
    // User has already made this reaction, remove it
    post.reactions[reactionType].users.splice(userReactionIndex, 1);
    post.reactions[reactionType].count--;
  } else {
    // User has not made this reaction, add it
    post.reactions[reactionType].users.push(userId);
    post.reactions[reactionType].count++;
    await notification.create({
      user: post.user,
      from: req.user._id,
      title: reactionType,
      type: 1,
      text: `${req.user.name} make ${reactionType} on your post`,
      read: false,
    });
  }

  await post.save();

  res.status(200).json(post);
});

export const getPost = getOne(Post);
