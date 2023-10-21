import express from "express";
import {
  forgetPassword,
  login,
  protect,
  resetPassword,
  singup,
  verifyResetCode,
} from "../controllers/auth.controller.js";
import {
  loginValidator,
  signUpValidator,
} from "../utils/validators/authValidator.js";
import { uploadSingleImage } from "../middlewares/uploadImage.middlesare.js";
import { getInfo, resizeImage } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/signup",
  uploadSingleImage("profileImg"),
  resizeImage,
  signUpValidator,
  singup
);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);
router.get("/info", protect, getInfo);


export default router;
