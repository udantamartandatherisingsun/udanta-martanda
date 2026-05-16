'use client';

import { motion } from 'framer-motion';

export default function DocumentariesAndNewspaper() {
  return (
    <div className="two-col">
      {/* Documentaries */}
      <div className="col-pane">
        <div className="sec-head" style={{ marginTop: 0 }}>
          <span className="sec-tag">Documentaries</span>
          <div className="sec-line"></div>
          <a href="#" className="sec-link">All →</a>
        </div>
        
        {[
          { cat: 'History · 52 min', title: 'The Forgotten Borders: Partition Stories Never Told', meta: 'इतिहास · History · 2026', imgSrc: '/assets/partition_doc_thumb.png' },
          { cat: 'Environment · 38 min', title: 'Rivers of Gold: India\'s Disappearing River Ecosystems', meta: 'पर्यावरण · Environment · 2026', imgSrc: '/assets/river_doc_thumb.png' },
          { cat: 'Technology · 44 min', title: 'Digital India: The Billion-User Revolution', meta: 'तकनीक · Technology · 2026', imgSrc: '/assets/digital_india_doc_thumb.png' }
        ].map((doc, i) => (
          <motion.article 
            key={i} 
            className="doc-item"
            whileHover={{ x: 5 }}
          >
            <div className="doc-thumb">
              <img 
                src={doc.imgSrc} 
                alt={doc.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
              <div className="fig-texture"></div>
              <div className="play"></div>
            </div>
            <div className="doc-info">
              <div className="cat" style={{ fontSize: '10px', color: 'var(--ink3)', marginBottom: '4px' }}>{doc.cat}</div>
              <h3>{doc.title}</h3>
              <div className="meta" style={{ fontSize: '10px', color: 'var(--ink4)' }}>{doc.meta}</div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Newspaper */}
      <div className="col-pane">
        <div className="sec-head" style={{ marginTop: 0 }}>
          <span className="sec-tag">E-Newspaper</span>
          <div className="sec-line"></div>
          <a href="#" className="sec-link">Archive →</a>
        </div>
        
        {[
          { date: '14 May 2026 · अंक संख्या 36,524', title: 'आज का अंक', desc: 'Today\'s complete print edition — all pages included' },
          { date: '13 May 2026 · अंक संख्या 36,523', title: 'कल का अंक', desc: 'Yesterday\'s edition including business supplements' },
          { date: '12 May 2026 · रविवासरीय विशेष', title: 'रविवासरीय संस्करण', desc: 'Sunday special with weekly magazine & analysis' }
        ].map((np, i) => (
          <motion.article 
            key={i} 
            className="np-item"
            whileHover={{ x: 5 }}
          >
            <div className="np-thumb">
              <div className="np-lines">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div className="np-info">
              <div className="meta" style={{ fontSize: '10px', color: 'var(--ink4)', marginBottom: '4px' }}>{np.date}</div>
              <h3>{np.title}</h3>
              <p style={{ fontSize: '12px', marginBottom: '6px' }}>{np.desc}</p>
              <a href="#" className="read-link" style={{ fontSize: '9px' }}>Read PDF →</a>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
