import express from "express";
import { upload } from "../middlewares/uploadImage.middlesare.js";
import { protect } from "../controllers/auth.controller.js";
import {
  createStory,
  getFriendsStories,
} from "../controllers/story.controller.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  upload("stories").array("media", 100),
  createStory
);
router.get("/friendsStories", protect, getFriendsStories);

export default router;
