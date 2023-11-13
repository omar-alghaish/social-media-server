import mongoose from "mongoose";
import modelOptions from "./model.option.js";

const storySchema = new mongoose.Schema(
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
    backgroundColor: {
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
      type: Date,
      required: true,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
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
          ref: "User",
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
    objects: [
      {
        type: { type: String, required: true },
        text: { type: String },
        position: {
          left: { type: Number, required: true },
          top: { type: Number, required: true },
        },
        text: String,
        scale: {
          width: { type: Number },
          height: { type: Number },
        },
        angle: { type: Number },
        font: {
          size: { type: Number },
          family: { type: String },
          weight: { type: String },
        },
        textAlign: { type: String },
        fill: { type: String },
        name: { type: String },
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
