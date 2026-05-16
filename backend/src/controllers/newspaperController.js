import Newspaper from '../models/Newspaper.js';

// @desc    Get all newspapers
// @route   GET /api/newspapers
// @access  Public
export const getNewspapers = async (req, res) => {
  try {
    const newspapers = await Newspaper.find().sort({ issueDate: -1 });
    res.json(newspapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a newspaper
// @route   POST /api/newspapers
// @access  Private
export const createNewspaper = async (req, res) => {
  const { title, issueDate, pdfUrl, imageUrl, description } = req.body;
  try {
    const newspaper = await Newspaper.create({
      title,
      issueDate,
      pdfUrl,
      imageUrl,
      description
    });
    res.status(201).json(newspaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a newspaper
// @route   PUT /api/newspapers/:id
// @access  Private
export const updateNewspaper = async (req, res) => {
  try {
    const newspaper = await Newspaper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!newspaper) return res.status(404).json({ message: 'Newspaper not found' });
    res.json(newspaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a newspaper
// @route   DELETE /api/newspapers/:id
// @access  Private
export const deleteNewspaper = async (req, res) => {
  try {
    const newspaper = await Newspaper.findByIdAndDelete(req.params.id);
    if (!newspaper) return res.status(404).json({ message: 'Newspaper not found' });
    res.json({ message: 'Newspaper removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
