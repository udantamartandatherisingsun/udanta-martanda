'use client';

import { motion } from 'framer-motion';

export default function Hero() {
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
            src="/assets/himalayan_glacier_hero.png" 
            alt="Himalayan Glacier" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="fig-texture"></div>
          <div className="fig-inner" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="fig-label">EXCLUSIVE REPORT · EXCLUSIVE REPORT</span>
            <div style={{ width: '80%', height: '1px', background: 'var(--border3)', opacity: 0.5 }}></div>
            <span className="fig-label" style={{ opacity: 0.5 }}>FILE: UM-2026-X44</span>
          </div>
        </motion.div>

        <div className="hero-cat">In-Depth · विशेष विश्लेषण</div>
        <h1 className="hero-h1">
          <a href="#">The Great Himalayan Melt: A Century of Change in Asia's Water Tower</a>
        </h1>
        <p className="hero-deck">
          New satellite data reveals that Himalayan glaciers are melting twice as fast as previously thought, 
          threatening the water security of over 1.6 billion people across the Indian subcontinent.
        </p>
        <div className="art-meta">
          <span className="by">By Arjun Kapur</span>
          <span className="sep">|</span>
          <span>14 May 2026</span>
          <span className="sep">|</span>
          <span className="hindi">12 मिनट पठन</span>
        </div>
      </div>

      <aside className="hero-side">
        <div className="side-head">Most Popular</div>
        {[
          { num: '01', title: 'The Silent Crisis: Why Rural Banking is Failing Small Farmers', cat: 'Economy' },
          { num: '02', title: 'Interview: The Physicist Searching for Dark Matter in a Gold Mine', cat: 'Science' },
          { num: '03', title: 'Reclaiming the Commons: Bangalore’s New Urban Forest Movement', cat: 'Environment' },
          { num: '04', title: 'The Death of the Monsoon? Predicting the Unpredictable', cat: 'Climate' }
        ].map((item, i) => (
          <div key={i} className="side-item">
            <div className="side-num">{item.num}</div>
            <h3><a href="#">{item.title}</a></h3>
            <div className="side-meta">{item.cat} · 5 min read</div>
          </div>
        ))}
      </aside>
    </section>
  );
}
