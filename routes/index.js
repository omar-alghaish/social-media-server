import express from "express";
import userRoute from "./user.route.js";
import authRouter from "./auth.route.js";

const router = express.Router();

router.use("/users", userRoute);
router.use("/", authRouter);
export default router;
