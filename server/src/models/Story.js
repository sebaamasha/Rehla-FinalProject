import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, minlength: 10, trim: true },
    imageUrl: { type: String, required: true, trim: true },

    // Link story to its author
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false  // Optional for backward compatibility with existing stories
    },
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
