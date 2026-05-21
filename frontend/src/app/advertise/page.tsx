'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import { Send } from 'lucide-react';

export default function AdvertisePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.adv-fade', {
        opacity: 0,
        y: 20,
        stagger: 0.2,
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
          <span className="sec-tag">Advertise</span>
          <div className="sec-line"></div>
          <span className="sec-aside">PARTNER WITH US</span>
        </div>

        <div className="grid grid-2" style={{ marginTop: '4rem', gap: '4rem', marginBottom: '4rem' }}>
          <div className="adv-fade">
            <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: 1.1 }}>
              Reach an engaged and discerning audience.
            </h2>
            <p className="lora" style={{ fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '2rem', opacity: 0.8 }}>
              Udant Martand offers premium advertising solutions, custom sponsorships, and deep content integrations for brands that want to make an impact.
            </p>
            <p className="lora" style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.8 }}>
              Whether you are looking for digital display advertising, newsletter sponsorships, or integrated documentary features, our team can help craft the perfect campaign.
            </p>
            
            <div style={{ marginTop: '3rem', padding: '2rem', border: '1px solid var(--border)' }}>
              <h3 className="mono" style={{ fontSize: '0.9rem', opacity: 0.5, letterSpacing: '0.1em', marginBottom: '1rem' }}>CONTACT ADVERTISING</h3>
              <p className="serif" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>udantamartandatherisingsun@gmail.com</p>
              <p className="serif" style={{ fontSize: '1.2rem' }}>+91 9244113993</p>
            </div>
          </div>

          <div className="adv-fade" style={{ padding: '3rem', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--border)' }}>
            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Request Media Kit</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>COMPANY NAME</label>
              <input type="text" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-lora)' }} placeholder="Acme Corp" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>EMAIL ADDRESS</label>
              <input type="email" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-lora)' }} placeholder="contact@example.com" />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label className="mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>CAMPAIGN GOALS</label>
              <textarea rows={4} style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-lora)', resize: 'none' }} placeholder="What are you looking to achieve?"></textarea>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
              <Send size={18} style={{ marginRight: '0.5rem' }} />
              Submit Request
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
