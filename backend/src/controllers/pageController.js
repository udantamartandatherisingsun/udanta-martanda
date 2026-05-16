import Page from '../models/Page.js';

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
export const getPage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upsert page content
// @route   POST /api/pages
// @access  Private
export const upsertPage = async (req, res) => {
  const { slug, title, content, metadata } = req.body;
  try {
    const page = await Page.findOneAndUpdate(
      { slug },
      { title, content, metadata, updatedAt: Date.now() },
      { upsert: true, new: true, runValidators: true }
    );
    res.json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all pages (for admin)
// @route   GET /api/pages
// @access  Private
export const getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
