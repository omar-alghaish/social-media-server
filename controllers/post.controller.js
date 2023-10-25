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
  res.status(201).json({ data: newPost });
});

export const getUserPost = asyncHandler(async(req,res,next)=>{
  const {id} = req.params;
  const posts = await Post.find({user:id})
  res.status(201).json({ data: posts });

})
