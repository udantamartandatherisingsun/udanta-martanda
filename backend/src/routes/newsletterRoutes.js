import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email' });
    }

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        await subscriber.save();
        return res.status(200).json({ success: true, data: subscriber });
      }
      return res.status(400).json({ success: false, error: 'Email is already subscribed' });
    }

    subscriber = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      data: subscriber
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/newsletter
// @desc    Get all subscribers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE /api/newsletter/:id
// @desc    Delete a subscriber
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }

    await subscriber.deleteOne();

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
