'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import DocumentariesAndNewspaper from '@/components/DocumentariesAndNewspaper';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/_/backend/api";

export default function DocumentariesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/news?category=Documentary`);
        if (res.ok) {
          const data = await res.json();
          setDocs(data);
        }
      } catch (err) {
        console.error('Failed to fetch documentaries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.sec-head, .card');
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
  }, [docs]);

  return (
    <div ref={containerRef}>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap">
        <div className="sec-head">
          <span className="sec-tag">Documentaries</span>
          <div className="sec-line"></div>
          <span className="sec-aside">VISUAL STORYTELLING</span>
        </div>
        
        <DocumentariesAndNewspaper />
        
        <div className="sec-head" style={{ marginTop: '4rem' }}>
          <span className="sec-tag">Archives</span>
          <div className="sec-line"></div>
        </div>
        
        {loading ? (
          <p className="mono" style={{ opacity: 0.5, textAlign: 'center', padding: '4rem' }}>Loading archive...</p>
        ) : (
          <div className="grid grid-3">
            {docs.map((doc) => (
              <Link key={doc._id} href={`/documentaries/${doc.slug}`} className="card-link">
                <div className="card">
                  <div className="card-cat">{doc.category.toUpperCase()}</div>
                  <h3 className="card-title">{doc.title}</h3>
                  <p className="card-excerpt">{doc.excerpt}</p>
                  <div className="card-meta">
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <span className="watch-link">Watch →</span>
                  </div>
                </div>
              </Link>
            ))}
            {docs.length === 0 && (
              <p className="lora" style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>No documentaries found in the archive.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
