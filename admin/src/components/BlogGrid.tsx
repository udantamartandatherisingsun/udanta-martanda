'use client';

import { motion } from 'framer-motion';

const blogPosts = [
  {
    cat: 'Opinion · विचार',
    title: 'Why India Urgently Needs a New Industrial Policy for the Age of AI',
    excerpt: 'As the global AI race intensifies, India\'s policy framework remains anchored in the pre-digital era. A rethinking is an existential necessity.',
    author: 'Ananya Verma',
    initials: 'AV',
    date: '14 May',
    imgSrc: '/assets/author_ananya_verma.png'
  },
  {
    cat: 'Culture · संस्कृति',
    title: 'The Last Ink-Makers of Varanasi: A Three-Century Craft Facing Extinction',
    excerpt: 'For three centuries, artisan families in Varanasi\'s lanes have produced the ink that coloured India\'s printed word. Today, barely seven remain.',
    author: 'Suresh Mishra',
    initials: 'SM',
    date: '12 May',
    imgSrc: '/assets/author_suresh_mishra.png'
  },
  {
    cat: 'Technology · तकनीक',
    title: 'Open-Source AI and the Question of Digital Sovereignty for the Global South',
    excerpt: 'The proliferation of large language models raises urgent questions about who controls the intellectual infrastructure of the digital future.',
    author: 'Rahul Khanna',
    initials: 'RK',
    date: '11 May',
    imgSrc: '/assets/author_rahul_khanna.png'
  }
];

export default function BlogGrid() {
  return (
    <div className="blog-grid">
      {blogPosts.map((post, idx) => (
        <motion.article 
          key={idx} 
          className="blog-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="hero-cat" style={{ fontSize: '9px' }}>{post.cat}</div>
          <h2><a href="#">{post.title}</a></h2>
          <p style={{ fontSize: '14px', marginBottom: '18px' }}>{post.excerpt}</p>
          <div className="author-row">
            <div className="ava" style={{ overflow: 'hidden', padding: 0 }}>
              <img 
                src={post.imgSrc} 
                alt={post.author} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="by-info">
              <strong>{post.author}</strong><br />
              {post.date} · 8 min read
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
