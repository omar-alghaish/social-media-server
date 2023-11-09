import Story from '../models/story.model.js'; // Import your Story model

export const disableExpiredStories = async () => {
  const currentDateTime = new Date();

  // Find stories that are active and have expired
  const expiredStories = await Story.find({
    isActive: true,
    expires_at: { $lte: currentDateTime },
  });

  // Disable expired stories
  for (const story of expiredStories) {
    await Story.findByIdAndUpdate(story._id, { isActive: false });
  }
};