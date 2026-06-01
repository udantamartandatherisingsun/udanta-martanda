'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NewsItem {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
}

interface NewsGridProps {
  category?: string;
}

export default function NewsGrid({ category = 'News' }: NewsGridProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/news?category=${category}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', padding: '40px 0' }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ height: '400px', background: 'var(--bg-paper)', opacity: 0.1, borderRadius: '4px' }}></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.5 }}>
        No {category.toLowerCase()} available at the moment.
      </div>
    );
  }

  return (
    <div className="news-grid">
      {items.map((item, idx) => (
        <motion.article 
          key={item._id} 
          className="news-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="n-img">
            <img 
              src={item.imageUrl || '/assets/placeholder.png'} 
              alt={item.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="fig-texture"></div>
          </div>
          <div className="hero-cat" style={{ fontSize: '8px' }}>{item.category}</div>
          <h2><Link href={`/news/${item.slug}`}>{item.title}</Link></h2>
          <p>{item.excerpt}</p>
          <Link href={`/news/${item.slug}`} className="read-link">Full Story →</Link>
        </motion.article>
      ))}
    </div>
  );
}
