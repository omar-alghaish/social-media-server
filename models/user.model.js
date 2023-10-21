import mongoose from "mongoose";
import bcrypt from "bcrypt";
import modelOptions from "./model.option.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: [true, "email must be unique"],
      lowercase: true,
    },
    phone: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "too short password"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  modelOptions
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//get update
userSchema.post("init", (doc) => {
  if (doc.profileImg) {
    const profileImgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = profileImgUrl;
  }
});

//create
userSchema.post("save", (doc) => {
  if (doc.profileImg) {
    const profileImgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = profileImgUrl;
  }
});

const User = mongoose.model("User", userSchema);

export default User;
