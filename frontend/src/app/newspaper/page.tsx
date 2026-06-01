'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import { Download, Calendar } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NewspaperEdition {
  _id: string;
  title: string;
  issueDate: string;
  pdfUrl: string;
  imageUrl?: string;
  description?: string;
}

export default function NewspaperPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editions, setEditions] = useState<NewspaperEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/newspapers`);
        const data = await response.json();
        setEditions(data);
      } catch (error) {
        console.error('Error fetching newspaper editions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, []);

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
  }, [loading]);

  const latestEdition = editions[0];

  return (
    <div ref={containerRef}>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap">
        <div className="sec-head">
          <span className="sec-tag">E-Newspaper</span>
          <div className="sec-line"></div>
          <span className="sec-aside">DIGITAL ARCHIVES</span>
        </div>
        
        {loading ? (
          <div style={{ height: '300px', background: 'var(--bg-paper)', opacity: 0.1, marginBottom: '4rem' }}></div>
        ) : latestEdition ? (
          <div className="newspaper-hero" style={{ marginBottom: '4rem', padding: '4rem', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{latestEdition.title}</h2>
            <p className="mono" style={{ opacity: 0.6, marginBottom: '2rem' }}>
              {new Date(latestEdition.issueDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <a href={latestEdition.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center' }}>
              <Download size={18} style={{ marginRight: '0.5rem' }} />
              Download PDF
            </a>
          </div>
        ) : (
          <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.5 }}>
            No editions available at the moment.
          </div>
        )}

        {editions.length > 1 && (
          <>
            <div className="sec-head">
              <span className="sec-tag">Recent Editions</span>
              <div className="sec-line"></div>
            </div>

            <div className="grid grid-3">
              {editions.slice(1).map((edition) => (
                <div key={edition._id} className="card edition-card" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
                  <Calendar size={24} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                  <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {new Date(edition.issueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </h3>
                  <p className="mono" style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1.5rem' }}>{edition.title}</p>
                  <a href={edition.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center' }}>
                    <Download size={14} style={{ marginRight: '0.5rem' }} />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
