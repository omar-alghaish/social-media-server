import express from "express";
import { upload } from "../middlewares/uploadImage.middlesare.js";
import { createPost, getUserPost, likePost, makeComment } from "../controllers/post.controller.js";
import { protect } from "../controllers/auth.controller.js";


const router = express.Router()

router.post('/create',protect, upload.array('media', 5), createPost);
router.get("/getPosts/:id",getUserPost)
router.post("/like",protect,likePost)
router.post("/comment",protect,makeComment)


export default router