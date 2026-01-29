import express from "express";
import Story from "../models/Story.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Setup uploads folder path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

/**
 * GET /api/stories
 * Returns all stories (newest first)
 */
router.get("/", optionalAuth, async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }).populate("author", "name email");

    // Add isOwner flag for each story
    const storiesWithOwnership = stories.map(story => ({
      ...story.toObject(),
      isOwner: req.user && story.author && story.author._id.toString() === req.user._id.toString()
    }));

    res.json(storiesWithOwnership);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stories" });
  }
});

/**
 * POST /api/stories
 * Create a story (requires authentication)
 */
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, location, description } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }
    if (!location || location.trim().length === 0) {
      return res.status(400).json({ message: "Location is required" });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Description must be at least 10 characters" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Trip photo is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const created = await Story.create({
      title: title.trim(),
      location: location.trim(),
      description: description.trim(),
      imageUrl,
      author: req.user._id,  // Link story to authenticated user
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/stories error:", err);

    if (err.message?.includes("Only image files")) {
      return res.status(400).json({ message: "Please upload an image file (jpg/png)." });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image must be 2MB or less." });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message || "Failed to create story" });
  }
});

/**
 * PUT /api/stories/:id
 * Update a story (only owner can update)
 */
router.put("/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, description } = req.body;

    // Find the story
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check ownership (allow if no author set for backward compatibility)
    if (story.author && story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own stories" });
    }

    const updateData = { title, location, description };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Story.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    if (err.message?.includes("Only image files")) {
      return res.status(400).json({ message: "Please upload an image file." });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image must be 2MB or less." });
    }
    res.status(400).json({ message: "Failed to update story" });
  }
});

/**
 * DELETE /api/stories/:id
 * Delete a story (only owner can delete)
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check ownership (allow if no author set for backward compatibility)
    if (story.author && story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own stories" });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete story" });
  }
});

export default router;
