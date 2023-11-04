import Comment from "../models/comments.model";
import asyncHandler from "express-async-handler"


const CreateComment = asyncHandler(async(req,res,next)=>{
    const { text, parentId } = req.body;
    const comment = new Comment({ text, parentId });
    await comment.save();

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      parentComment.replies.push(comment._id);
      await parentComment.save();
    }

    res.status(201).json(comment);
})


const getCommentReplies = asyncHandler(async(req,res,next)=>{
    const replies = await Comment.find({ parentId }).populate('replies');
    res.status(200).json(replies);
})