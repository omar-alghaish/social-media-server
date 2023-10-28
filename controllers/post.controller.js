import sharp from "sharp";
import Post from "../models/post.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const mediaFiles = req.files;
  const newPost = await Post.create({
    user: req.user.id,
    userProfile: req.user.profileImgUrl,
    userName: req.user.name,
    content: req.body.content,
    media: mediaFiles,
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
  // const friendsPosts = await Post.find({user:{$in: friends}}).po
 
  const documentsCounts = await Post.countDocuments();

  const apiFeatures = new ApiFeatures(
    Post.find({ user: { $in: friends } }),
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
