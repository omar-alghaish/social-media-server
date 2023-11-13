import express from "express";
import userRoute from "./user.route.js";
import authRouter from "./auth.route.js";
import postRoute from "./post.route.js";
import notificationRoute from "./notification.route.js";
import storyRoute from "./story.route.js";

const router = express.Router();

router.use("/users", userRoute);
router.use("/posts", postRoute);
router.use("/story", storyRoute);
router.use("/notification", notificationRoute);

router.use("/", authRouter);
export default router;
