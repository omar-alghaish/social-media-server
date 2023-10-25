import mongoose from "mongoose";
import modelOptions from "./model.option.js";

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    media: [
      {
        mimetype:String,
        filename:String,
        path:String,
        size:Number,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
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
    let mediaArray = []
    doc.media.map((item)=>{
        mediaArray.push({...item, path:`${process.env.BASE_URL}/posts/${item.filename}`}) 
    })
  doc.media= mediaArray
}
  });
  
  //create
  postSchema.post("save", (doc) => {
    if (doc.media) {
        let mediaArray = []
        doc.media.map((item)=>{
            mediaArray.push({...item, path:`${process.env.BASE_URL}/posts/${item.filename}`}) 
        })
      doc.media= mediaArray
    }
  });

const Post = mongoose.model('Post', postSchema);

export default Post;

