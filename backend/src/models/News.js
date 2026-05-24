import mongoose from 'mongoose';

// Converts a title to a URL-friendly slug
// e.g. "India's Cultural Legacy!" → "indias-cultural-legacy"
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')                    // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')    // strip accent marks
    .replace(/[^a-z0-9\s-]/g, '')      // remove special chars
    .trim()
    .replace(/\s+/g, '-')              // spaces → hyphens
    .replace(/-+/g, '-')               // collapse multiple hyphens
    .substring(0, 100);                // max 100 chars
}

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Editorial Team'
  },
  imageUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
});

// Auto-generate slug before saving if not already set
newsSchema.pre('save', async function () {
  if (!this.isModified('title') && !this.isModified('slug') && this.slug) {
    return;
  }

  let baseSlug;
  if (this.isModified('slug') && this.slug) {
    baseSlug = this.slug;
  } else {
    baseSlug = generateSlug(this.title);
  }

  if (!baseSlug) {
    baseSlug = 'article';
  }

  let slug = baseSlug;
  let counter = 1;

  // Ensure uniqueness by appending a counter on collision
  while (true) {
    const existing = await mongoose.model('News').findOne({ slug, _id: { $ne: this._id } });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;
});

const News = mongoose.model('News', newsSchema);

export default News;
