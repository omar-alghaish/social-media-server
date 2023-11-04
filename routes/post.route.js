import express from "express";
import { upload } from "../middlewares/uploadImage.middlesare.js";
import { createPost, getFriendsPosts, getPostsByHashtag, getUserPost, likePost, makeComment, reactPost } from "../controllers/post.controller.js";
import { protect } from "../controllers/auth.controller.js";


const router = express.Router()

router.post('/create',protect, upload.array('media', 5), createPost);
router.get("/getPosts/:id",getUserPost)
router.get("/tags/:tag",getPostsByHashtag)

router.get("/friendsPosts", protect, getFriendsPosts)
router.post("/like",protect,likePost)
router.post("/comment",protect,makeComment)
router.post("/:postId/react",protect,reactPost)



export default router