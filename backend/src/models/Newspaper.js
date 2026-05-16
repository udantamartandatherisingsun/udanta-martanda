import mongoose from 'mongoose';

const newspaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Newspaper = mongoose.model('Newspaper', newspaperSchema);

export default Newspaper;
