import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId,ref: "User", require: true },
    from: { type: mongoose.Schema.Types.ObjectId,ref: "User", require: true },

    title: { type: String, require: true },
    type: { type: Number, required: true },
    text: { type: String, require: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)
export default mongoose.model('notification', notificationSchema)
