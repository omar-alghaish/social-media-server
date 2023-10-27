import express from "express";
import { uploadSingleImage } from "../middlewares/uploadImage.middlesare.js";
import {
  acceptFriend,
  activate,
  addFriend,
  changeUserPassword,
  createUser,
  deActivate,
  deleteUser,
  follow,
  getInfo,
  getLoggedUserData,
  getUser,
  getUsers,
  resizeImage,
  updateUser,
} from "../controllers/user.controller.js";
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from "../utils/validators/userValidator.js";
import { protect, allowedTo } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/me", protect, getLoggedUserData, getUser);
router.get("/me/deActive", protect, deActivate);
router.get("/me/active", protect, activate);

// router.use(protect, allowedTo("admin", "manager"));

router.post(
  "/create",
  uploadSingleImage("profileImg"),
  resizeImage,
  createUserValidator,
  createUser
);

router.get("/", getUsers);
router.post("/addFriend",protect, addFriend)
router.post("/acceptFriend",protect, acceptFriend)
router.post("/follow",protect, follow)

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .delete(deleteUserValidator, deleteUser)
  .put(
    uploadSingleImage("profileImg"),
    resizeImage,
    updateUserValidator,
    updateUser
  );

router.put("/changePassword/:id", changeUserPassword);

export default router;
