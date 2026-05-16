'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import BlogGrid from '@/components/BlogGrid';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BlogPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap">
        <div className="sec-head">
          <span className="sec-tag">The Inkwell</span>
          <div className="sec-line"></div>
          <span className="sec-aside">OPINION & ANALYSIS</span>
        </div>
        
        <BlogGrid />
        <div style={{ marginTop: '4rem' }}>
          <BlogGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
