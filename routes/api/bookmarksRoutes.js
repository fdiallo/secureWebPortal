// routes/bookmarks.js
const express = require('express');
const Bookmark = require('../models/Bookmark');
const { authMiddleware } = require('../utils/auth');
const router = express.Router();

// Apply Auth Middleware to all routes in this file
router.use(authMiddleware);

// CREATE
router.post('/', async (req, res) => {
  try {
    const newBookmark = await Bookmark.create({ ...req.body, user: req.user.id });
    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL for Logged-In User
router.get('/', async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user.id });
  res.json(bookmarks);
});

// GET ONE
router.get('/:id', async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);
  if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
  
  // Authorization: Check if the requester owns the bookmark
  if (bookmark.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to view this bookmark' });
  }
  res.json(bookmark);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);
  if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

  if (bookmark.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to update this bookmark' });
  }

  const updatedBookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBookmark);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const bookmark = await Bookmark.findById(req.params.id);
  if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

  if (bookmark.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this bookmark' });
  }

  await Bookmark.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bookmark deleted successfully' });
});

module.exports = router;
