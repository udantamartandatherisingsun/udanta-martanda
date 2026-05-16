'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pages/contact');
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error('Failed to fetch contact page:', err);
      }
    };
    fetchPage();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-info > div', {
        opacity: 0,
        x: -30,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.from('.contact-form', {
        opacity: 0,
        x: 30,
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
          <span className="sec-tag">Contact Us</span>
          <div className="sec-line"></div>
          <span className="sec-aside">GET IN TOUCH</span>
        </div>
        
        <div className="grid grid-2" style={{ marginTop: '4rem', gap: '4rem' }}>
          <div className="contact-info">
            {pageData ? (
              <>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>{pageData.title}</h2>
                <div 
                  className="lora" 
                  style={{ marginBottom: '3rem', opacity: 0.7 }}
                  dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
              </>
            ) : (
              <>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Reach Out</h2>
                <p className="lora" style={{ marginBottom: '3rem', opacity: 0.7 }}>
                  Have a story tip, a question about your subscription, or just want to say hello? 
                  Our team is ready to listen.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--border)' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block' }}>EMAIL</span>
                    <span className="serif" style={{ fontSize: '1.2rem' }}>editorial@udantmartand.in</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--border)' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block' }}>PHONE</span>
                    <span className="serif" style={{ fontSize: '1.2rem' }}>+91 731 245 0000</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--border)' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '0.8rem', opacity: 0.5, display: 'block' }}>OFFICE</span>
                    <span className="serif" style={{ fontSize: '1.2rem' }}>12, Press Complex, A.B. Road<br />Indore, MP 452001, India</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="contact-form" style={{ padding: '3rem', border: '1px solid var(--border)', backgroundColor: 'var(--bg-paper)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <label className="mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>FULL NAME</label>
              <input type="text" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-lora)' }} placeholder="John Doe" />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className="mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>EMAIL ADDRESS</label>
              <input type="email" style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-lora)' }} placeholder="john@example.com" />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="mono" style={{ fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>MESSAGE</label>
              <textarea rows={5} style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'var(--font-lora)', resize: 'none' }} placeholder="How can we help?"></textarea>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}>
              <Send size={18} style={{ marginRight: '0.5rem' }} />
              Send Message
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
