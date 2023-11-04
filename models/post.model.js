import mongoose from "mongoose";
import modelOptions from "./model.option.js";

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
    },
    userProfile: {
      type: String,
    },
    content: {
      type: String,
    },
    mentions: [{ type: String }],
    hashtags: [{ type: String }],
    media: [
      {
        mimetype: String,
        filename: String,
        path: String,
        size: Number,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reactions: {
      like: {
        count: { type: Number, default: 0 },
        users: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
      love: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      haha: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      wow: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      sad: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
      angry: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      },
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfile: {
          type: String,
        },
        userName: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  modelOptions
);

//get update
postSchema.post("init", (doc) => {
  if (doc.media) {
    let mediaArray = [];
    doc.media.map((item) => {
      mediaArray.push({
        ...item,
        path: `${process.env.BASE_URL}/posts/${item.filename}`,
      });
    });
    doc.media = mediaArray;
  }
});

//create
postSchema.post("save", (doc) => {
  if (doc.media) {
    let mediaArray = [];
    doc.media.map((item) => {
      mediaArray.push({
        ...item,
        path: `${process.env.BASE_URL}/posts/${item.filename}`,
      });
    });
    doc.media = mediaArray;
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
