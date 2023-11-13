import notification from "../models/notifications.model.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";

// @desc Get all notifications
// @Route GET /notes
// @Access Private
const getAllNotifications = asyncHandler(async (req, res, next) => {
  const documentsCounts = await notification.countDocuments();

  const apiFeatures = new ApiFeatures(
    notification.find({ user: req.user._id }).populate("from"),
    req.query
  )
    .filter()
    .paginate(documentsCounts)
    .search()
    .sort({ createdAt: -1 });

  const { mongooseQuery, pagination } = apiFeatures;
  const documents = await mongooseQuery;

  res
    .status(200)
    .json({ results: documents.length, pagination, data: documents });
});

// @desc delete a notification
// @Route DELETE /notifications
// @Private access
const deleteNotification = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }

  const deleteNotification = await notification.findById(id).exec();
  if (!deleteNotification) {
    return res
      .status(400)
      .json({ message: `Can't find a notification with id: ${id}` });
  }
  const result = await deleteNotification.deleteOne();
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the notification with id: ${id}` });
  }
  res.json({ message: `Notification with id: ${id} deleted with success` });
};

// @desc delete All notification
// @Route DELETE /notifications/all
// @Private access
const deleteAllNotifications = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsDeleteMany = await notification.deleteMany({ user: id });
  if (!notificationsDeleteMany) {
    return res
      .status(400)
      .json({ message: "Error Deleting all notifications as read" });
  }
  res.json({ message: `All notifications for user ${id}marked was deleted` });
};
// @desc Mark One Notification As Read
// @Route Patch /notifications/
// @Access Private
const markOneNotificationasread = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const updateNotification = await notification.find({ id }).exec();
  if (!updateNotification) {
    return res.status(400).json({ message: "No notifications found" });
  }
  updateNotification.read = false;
  await updateNotification.save();
  res.json(updateNotification);
};
// @desc Mark All Notifications As Read
// @Route Patch /notifications/All
// @Access Private
const markAllNotificationsAsRead = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsUpdateMany = await notification.updateMany(
    { user: id },
    { $set: { read: true } }
  );
  if (!notificationsUpdateMany) {
    return res
      .status(400)
      .json({ message: "Error Marking all notifications as read" });
  }
  res.json({ message: `All notifications for user ${id}marked as read` });
};
export default {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  markOneNotificationasread,
  markAllNotificationsAsRead,
};
