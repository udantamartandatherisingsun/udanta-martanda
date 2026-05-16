'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import Hero from '@/components/Hero';
import NewsGrid from '@/components/NewsGrid';
import DocumentariesAndNewspaper from '@/components/DocumentariesAndNewspaper';
import BlogGrid from '@/components/BlogGrid';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal sections on scroll
      const sections = gsap.utils.toArray('.sec-head');
      sections.forEach((sec: any) => {
        gsap.from(sec, {
          scrollTrigger: {
            trigger: sec,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Subtle parallax for Hero
      gsap.to('.hero-fig img', {
        scrollTrigger: {
          trigger: '.hero-fig',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: 50,
        ease: 'none'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <BreakingTicker />
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap">
        {/* Top News Section */}
        <div className="sec-head">
          <span className="sec-tag">Top Stories</span>
          <div className="sec-line"></div>
          <span className="sec-aside">LAST UPDATED: 14 MAY 2026, 09:44 AM IST</span>
        </div>
        
        <Hero />
        <NewsGrid />

        {/* Feature Section */}
        <div className="sec-head">
          <span className="sec-tag">Special Features</span>
          <div className="sec-line"></div>
        </div>
        
        <DocumentariesAndNewspaper />

        {/* Blog Section */}
        <div className="sec-head">
          <span className="sec-tag">Blog & Analysis</span>
          <div className="sec-line"></div>
          <a href="#" className="sec-link">View All Posts →</a>
        </div>
        
        <BlogGrid />

        {/* Newsletter Section */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
