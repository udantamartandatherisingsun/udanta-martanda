import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Page = mongoose.model('Page', pageSchema);

export default Page;
