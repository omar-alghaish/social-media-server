import sharp from "sharp";
import Post from "../models/post.model.js";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const mediaFiles = req.files;
  const newPost = await Post.create({
    user: req.user.id,
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
  }else{
      post.likes.push(req.user._id);

  }
  await post.save();
  res.status(200).json({ data: post.likes });
});
