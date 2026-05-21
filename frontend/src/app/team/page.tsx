'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TeamPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-member', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
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
          <span className="sec-tag">Our Team</span>
          <div className="sec-line"></div>
          <span className="sec-aside">THE PEOPLE BEHIND THE NEWS</span>
        </div>
        
        <div style={{ maxWidth: '1000px', margin: '4rem auto' }}>
          <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Meet the Editorial Board
          </h2>
          <p className="lora" style={{ fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '4rem', opacity: 0.8 }}>
            Udant Martand brings together veteran journalists, investigative reporters, and innovative storytellers committed to delivering truth and transparency.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div className="team-member">
              <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--border)', marginBottom: '1.5rem' }}></div>
              <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Arjun Kapur</h3>
              <p className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '1rem' }}>EDITOR-IN-CHIEF</p>
              <p className="lora" style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.7 }}>
                Award-winning journalist with over 20 years of experience in political and investigative reporting across major Indian publications.
              </p>
            </div>

            <div className="team-member">
              <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--border)', marginBottom: '1.5rem' }}></div>
              <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Meera Sharma</h3>
              <p className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '1rem' }}>MANAGING EDITOR</p>
              <p className="lora" style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.7 }}>
                Specializes in environmental and social justice issues. Her documentaries have won several national awards.
              </p>
            </div>

            <div className="team-member">
              <div style={{ width: '100%', aspectRatio: '1', backgroundColor: 'var(--border)', marginBottom: '1.5rem' }}></div>
              <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Rohan Desai</h3>
              <p className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '1rem' }}>HEAD OF DIGITAL</p>
              <p className="lora" style={{ fontSize: '1rem', lineHeight: 1.6, opacity: 0.7 }}>
                Pioneer in data journalism and interactive storytelling, leading our digital transformation and multimedia projects.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
