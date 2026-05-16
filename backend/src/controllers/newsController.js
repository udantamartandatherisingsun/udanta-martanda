import News from '../models/News.js';

// @desc    Get all news
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  try {
    const news = await News.find(filter).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a news item
// @route   POST /api/news
// @access  Private (for now public for testing)
export const createNews = async (req, res) => {
  const { title, excerpt, content, category, imageUrl } = req.body;

  try {
    const news = await News.create({
      title,
      excerpt,
      content,
      category,
      imageUrl
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a news item
// @route   PUT /api/news/:id
// @access  Private
export const updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a news item
// @route   DELETE /api/news/:id
// @access  Private
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
