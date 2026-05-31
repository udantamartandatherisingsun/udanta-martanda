'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import RichContentRenderer from '@/components/RichContentRenderer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/_/backend/api"}/pages/about`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error('Failed to fetch about page:', err);
      }
    };
    fetchPage();
  }, []);

  useEffect(() => {
    if (!pageData) return;
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.sec-head, .about-content p, .about-content h2, .dynamic-content *');
      sections.forEach((sec: any) => {
        gsap.from(sec, {
          scrollTrigger: {
            trigger: sec,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          y: 20,
          duration: 1,
          ease: 'power3.out'
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pageData]);

  return (
    <div ref={containerRef}>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap">
        <div className="sec-head">
          <span className="sec-tag">Our History</span>
          <div className="sec-line"></div>
          <span className="sec-aside">ESTABLISHED 1826</span>
        </div>
        
        <article className="about-content" style={{ maxWidth: '800px', margin: '4rem auto' }}>
          {pageData ? (
            <>
              <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '2rem', lineHeight: 1.1 }}>
                {pageData.title}
              </h2>
              <RichContentRenderer 
                content={pageData.content}
                className="dynamic-content" 
                style={{ fontSize: '1.25rem', lineHeight: 1.8 }}
              />
            </>
          ) : (
            <>
              <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '2rem', lineHeight: 1.1 }}>
                Udant Martand: The First Hindi Newspaper
              </h2>
              
              <p className="lora" style={{ fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Udant Martand (The Rising Sun) was the first Hindi language newspaper published in India. 
                Started on May 30, 1826, from Calcutta (now Kolkata) by Pt. Jugal Kishore Shukla, 
                it marked the beginning of Hindi journalism.
              </p>

              <p className="lora" style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.8 }}>
                At a time when the British East India Company controlled most narratives, Udant Martand 
                stood as a beacon of independent thought and cultural pride. Though it faced immense 
                financial and postal challenges, its legacy lives on as a symbol of the power of the press.
              </p>

              <div style={{ padding: '3rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '4rem 0', textAlign: 'center' }}>
                <span className="hindi" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>
                  "सत्य और स्वतंत्रता का उदघोष"
                </span>
                <span className="mono" style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                  The Proclamation of Truth and Freedom
                </span>
              </div>

              <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Our Mission Today</h2>
              
              <p className="lora" style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.8 }}>
                Today, we continue that heritage by providing rigorous, independent journalism 
                in the digital age. Our focus remains on storytelling that matters—from deep-dive 
                documentaries to investigative reporting that holds power to account.
              </p>

              <p className="lora" style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.8 }}>
                We believe in the power of the written word to inspire, inform, and ignite change. 
                Welcome to the new Udant Martand.
              </p>
            </>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
