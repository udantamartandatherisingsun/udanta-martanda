import express from 'express';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/contacts
// @desc    Submit a contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and message' });
    }

    const contact = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/contacts
// @desc    Get all contact submissions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact submission
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
