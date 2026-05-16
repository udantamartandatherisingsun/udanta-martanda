'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
}

export default function BlogGrid() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news?category=Blog');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', padding: '40px 0' }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ height: '300px', background: 'var(--bg-paper)', opacity: 0.1, borderRadius: '4px' }}></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.5 }}>
        No blog posts available at the moment.
      </div>
    );
  }

  return (
    <div className="blog-grid">
      {items.map((post, idx) => (
        <motion.article 
          key={post._id} 
          className="blog-card"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="hero-cat" style={{ fontSize: '9px' }}>{post.category}</div>
          <h2><a href="#">{post.title}</a></h2>
          <p style={{ fontSize: '14px', marginBottom: '18px' }}>{post.excerpt}</p>
          <div className="author-row">
            <div className="ava" style={{ overflow: 'hidden', padding: 0 }}>
              <img 
                src={post.imageUrl || '/assets/placeholder-avatar.png'} 
                alt={post.author} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="by-info">
              <strong>{post.author}</strong><br />
              {new Date(post.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} · 8 min read
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
