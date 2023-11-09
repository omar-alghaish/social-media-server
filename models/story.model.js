import mongoose from "mongoose";
import modelOptions from "./model.option.js";

// Define the schema for social media stories
const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for the creator of the story
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
    expires_at: {
      type: Date, // Date when the story will expire and be automatically removed
      required: true,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model for users who viewed the story
      },
    ],
    isActive: {
      type: Boolean,
      default:true,
    },
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
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model for the commenter
        },
        text: {
          type: String,
          required: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  modelOptions
);

//get update
storySchema.post("init", (doc) => {
  if (doc.media) {
    let mediaArray = [];
    doc.media.map((item) => {
      mediaArray.push({
        ...item,
        path: `${process.env.BASE_URL}/stories/${item.filename}`,
      });
    });
    doc.media = mediaArray;
  }
});

//create
storySchema.post("save", (doc) => {
  if (doc.media) {
    let mediaArray = [];
    doc.media.map((item) => {
      mediaArray.push({
        ...item,
        path: `${process.env.BASE_URL}/stories/${item.filename}`,
      });
    });
    doc.media = mediaArray;
  }
});


const Story = mongoose.model("Story", storySchema);

export default Story;
