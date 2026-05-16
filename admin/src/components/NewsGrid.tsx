'use client';

import { motion } from 'framer-motion';

const newsItems = [
  {
    cat: 'Politics · राजनीति',
    title: 'Coalition Dynamics: The New Power Centers in Indian Federalism',
    excerpt: 'As regional parties assert themselves, the traditional dominance of national parties is being challenged in ways not seen since the late 90s.',
    imgClass: 't1',
    imgSrc: '/assets/politics_india_b_w.png'
  },
  {
    cat: 'Tech · तकनीक',
    title: 'The Silicon Frontier: Can India Become a Global Semiconductor Hub?',
    excerpt: 'Billions in subsidies are attracting global giants to Gujarat and Tamil Nadu. But infrastructure and talent remain critical bottlenecks.',
    imgClass: 't2',
    imgSrc: '/assets/semiconductor_lab_tech.png'
  },
  {
    cat: 'Culture · संस्कृति',
    title: 'The Digital Archive of Folk Music: Preserving Oral Traditions',
    excerpt: 'A new initiative is digitizing thousands of hours of traditional folk music from across India, ensuring these voices are never lost.',
    imgClass: 't3',
    imgSrc: '/assets/indian_folk_music_culture.png'
  }
];

export default function NewsGrid() {
  return (
    <div className="news-grid">
      {newsItems.map((item, idx) => (
        <motion.article 
          key={idx} 
          className="news-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className={`n-img ${item.imgClass}`}>
            <img 
              src={item.imgSrc} 
              alt={item.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="fig-texture"></div>
          </div>
          <div className="hero-cat" style={{ fontSize: '8px' }}>{item.cat}</div>
          <h2><a href="#">{item.title}</a></h2>
          <p>{item.excerpt}</p>
          <a href="#" className="read-link">Full Story →</a>
        </motion.article>
      ))}
    </div>
  );
}
