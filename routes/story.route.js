import express from "express";
import { upload } from "../middlewares/uploadImage.middlesare.js";
import { protect } from "../controllers/auth.controller.js";
import { createStory } from "../controllers/story.controller.js";


const router = express.Router()

router.post("/create",protect, upload("stories").array('media', 100), createStory)



export default router