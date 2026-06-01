'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface NewsItem {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  views?: number;
}

const fallbackPopular: NewsItem[] = [
  { slug: 'bengal-hindi-200-years', title: '200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार', category: 'Heritage', views: 320 },
  { slug: '#', title: 'The Silent Crisis: Why Rural Banking is Failing Small Farmers', category: 'Economy', views: 245 },
  { slug: '#', title: 'Interview: The Physicist Searching for Dark Matter in a Gold Mine', category: 'Science', views: 189 },
  { slug: '#', title: 'Reclaiming the Commons: Bangalore’s New Urban Forest Movement', category: 'Environment', views: 154 }
];

export default function Hero() {
  const [popularNews, setPopularNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/news?sort=popular&limit=4`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPopularNews(data);
          }
        }
      } catch (error) {
        console.error('Error fetching popular news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const displayItems = popularNews.length > 0 ? popularNews : fallbackPopular;

  return (
    <section className="hero">
      <div className="hero-main">
        <motion.div 
          className="hero-fig"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ position: 'relative' }}
        >
          <img 
            src="/assets/bengal_hindi_200_years.png" 
            alt="200 Years of Hindi in Bengal" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="fig-texture"></div>
          <div className="fig-inner" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="fig-label">HERITAGE SPECIAL · ऐतिहासिक विशेष</span>
            <div style={{ width: '80%', height: '1px', background: 'var(--border3)', opacity: 0.5 }}></div>
            <span className="fig-label" style={{ opacity: 0.5 }}>FILE: UM-1826-2026</span>
          </div>
        </motion.div>

        <div className="hero-cat">Heritage · विरासत</div>
        <h1 className="hero-h1">
          <Link href="/news/bengal-hindi-200-years">200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार, और आज बंगाल में गूंजती है हिंदी</Link>
        </h1>
        <p className="hero-deck hindi">
          30 मई 1826 को कलकत्ता की सड़कों से शुरू हुआ 'उदन्त मार्तण्ड' का सफर, आज दो सदी बाद बंगाल की सांस्कृतिक रगों में हिंदी बनकर दौड़ रहा है।
        </p>
        <div className="art-meta">
          <span className="by">By Editorial Board</span>
          <span className="sep">|</span>
          <span>30 May 2026</span>
          <span className="sep">|</span>
          <span className="hindi">5 मिनट पठन</span>
        </div>
      </div>

      <aside className="hero-side">
        <div className="side-head">Most Popular</div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ height: '70px', background: 'var(--bg-paper)', opacity: 0.1, borderRadius: '4px' }}></div>
            ))}
          </div>
        ) : (
          displayItems.map((item, i) => (
            <div key={item._id || i} className="side-item">
              <div className="side-num">{(i + 1).toString().padStart(2, '0')}</div>
              <h3>
                <Link href={item.slug === '#' ? '#' : `/news/${item.slug}`}>
                  {item.title}
                </Link>
              </h3>
              <div className="side-meta">{item.category} · {item.views || 0} views</div>
            </div>
          ))
        )}
      </aside>
    </section>
  );
}

