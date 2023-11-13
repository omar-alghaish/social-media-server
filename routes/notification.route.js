import express from "express";
const router = express.Router();
import notificationController from "../controllers/notification.controller.js";
import { protect } from "../controllers/auth.controller.js";
router
  .route("/")
  .post(notificationController.getAllNotifications)
  .delete(notificationController.deleteNotification)
  .patch(notificationController.markOneNotificationasread);

router
  .route("/all")
  .delete(notificationController.deleteAllNotifications)
  .patch(notificationController.markAllNotificationsAsRead);

router.get("/", protect, notificationController.getAllNotifications);

export default router;
