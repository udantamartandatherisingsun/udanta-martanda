'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import RichContentRenderer from '@/components/RichContentRenderer';

interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  author?: string;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/news/slug/${params.slug}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setArticle(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params?.slug]);

  if (loading) {
    return (
      <div>
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
          <article style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Skeleton */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: i === 0 ? '60px' : i === 1 ? '200px' : '20px',
                  marginBottom: '1.5rem',
                  background: 'var(--bg-paper)',
                  opacity: 0.12,
                  borderRadius: '4px',
                  width: i === 2 ? '60%' : '100%',
                }}
              />
            ))}
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div>
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem', textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: '6rem', opacity: 0.15, marginBottom: '1rem' }}>404</h1>
          <p className="lora" style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '2rem' }}>
            This article could not be found.
          </p>
          <Link href="/news" style={{ borderBottom: '1px solid var(--ink)', paddingBottom: '2px', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← Back to News
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const publishDate = new Date(article.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          {/* Meta header */}
          <div className="sec-head" style={{ marginBottom: '2rem' }}>
            <span className="sec-tag">{article.category}</span>
            <div className="sec-line" />
            <span className="sec-aside">{publishDate}</span>
          </div>

          {/* Title */}
          <h1
            className="serif"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: '1.25', marginBottom: '1.5rem' }}
          >
            {article.title}
          </h1>

          {/* Excerpt / lead */}
          <p
            className="lora"
            style={{ fontSize: '1.25rem', opacity: 0.75, marginBottom: '2.5rem', lineHeight: '1.7', fontStyle: 'italic' }}
          >
            {article.excerpt}
          </p>

          {/* Hero image */}
          {article.imageUrl && (
            <div style={{ position: 'relative', width: '100%', height: '480px', marginBottom: '3rem', overflow: 'hidden' }}>
              <img
                src={article.imageUrl}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="fig-texture" />
            </div>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', opacity: 0.4 }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--ink)' }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {article.author || 'Udant Martand Staff'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--ink)' }} />
          </div>

          {/* Article body */}
          <RichContentRenderer content={article.content} />

          {/* Back link */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--ink)', opacity: 0.5 }}>
            <Link
              href="/news"
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--ink)',
                paddingBottom: '2px',
              }}
            >
              ← All News
            </Link>
          </div>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
}
