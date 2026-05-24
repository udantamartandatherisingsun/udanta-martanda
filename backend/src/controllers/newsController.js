import News from '../models/News.js';

// @desc    Get all news
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
  const { category, sort, limit, search } = req.query;
  
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    let query = News.find(filter);
    
    if (sort === 'popular') {
      query = query.sort({ views: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const news = await query;
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a news item
// @route   POST /api/news
// @access  Private (for now public for testing)
export const createNews = async (req, res) => {
  const { title, excerpt, content, category, imageUrl, videoUrl } = req.body;

  try {
    const news = await News.create({
      title,
      excerpt,
      content,
      category,
      imageUrl,
      videoUrl
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

// @desc    Get a news item by slug
// @route   GET /api/news/slug/:slug
// @access  Public
export const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a news item by ID (kept for admin internal use)
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

