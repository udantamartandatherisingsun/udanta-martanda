'use client';

import { motion } from 'framer-motion';

const tickerItems = [
  "नई दिल्ली: संसद में बजट सत्र आज से शुरू — वित्त मंत्री करेंगी बजट पेश",
  "PM Modi addresses UN General Assembly on climate action & global South cooperation",
  "मध्यप्रदेश: इंदौर लगातार सातवीं बार बना देश का सबसे स्वच्छ शहर",
  "ISRO successfully launches GSLV Mk-III carrying communication satellite into orbit",
  "Supreme Court delivers historic ruling on electoral bonds transparency",
  "भारत–पाक सीमा पर तनाव: सेना उच्च अलर्ट पर, केंद्र ने बुलाई आपात बैठक",
];

export default function BreakingTicker() {
  return (
    <div className="ticker-strip" role="marquee" aria-label="Breaking news">
      <div className="ticker-badge">Breaking</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {/* Duplicate items for seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
