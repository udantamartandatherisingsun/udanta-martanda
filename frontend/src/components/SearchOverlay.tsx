'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  views?: number;
  createdAt?: string;
}

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle open/close body scroll locking and esc key listener
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
      setResults([]);
    }
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Debounced search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/news?search=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Error searching archives:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const getRoute = (category: string, slug: string) => {
    const catLower = category?.toLowerCase();
    if (catLower === 'blog') return `/blog/${slug}`;
    if (catLower === 'documentary' || catLower === 'documentaries') return `/documentaries/${slug}`;
    return `/news/${slug}`;
  };

  const handleTrendingClick = (topic: string) => {
    setSearchQuery(topic);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="search-overlay open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '10vh',
            alignItems: 'center',
            background: 'rgba(10, 8, 6, 0.98)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            aria-label="Close search overlay"
            style={{ 
              position: 'absolute', 
              top: '40px', 
              right: '44px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--ink3)', 
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink3)'}
          >
            <X size={32} />
          </button>

          <div className="search-box" style={{ width: '100%', maxWidth: '720px', padding: '0 24px' }}>
            {/* Input Wrapper with Search Icon */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search 
                size={28} 
                style={{ 
                  position: 'absolute', 
                  left: '0', 
                  color: searchQuery ? 'var(--red)' : 'var(--ink4)',
                  transition: 'color 0.3s'
                }} 
              />
              <motion.input 
                ref={inputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the archives..." 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--border3)',
                  padding: '14px 10px 14px 44px',
                  color: '#fff',
                  fontFamily: 'var(--serif)',
                  fontSize: '32px',
                  fontWeight: 300,
                  outline: 'none',
                  caretColor: 'var(--red)',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--red)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border3)'}
              />
              {isLoading && (
                <Loader2 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    color: 'var(--ink3)',
                    animation: 'spin 1s linear infinite'
                  }} 
                />
              )}
            </div>

            {/* Trending Links */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="sec-aside" style={{ color: 'var(--ink4)' }}>TRENDING:</span>
              {['Artificial Intelligence', 'Climate Change', 'Storytelling', 'Cultural Revival'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTrendingClick(topic)}
                  className="sec-link"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: searchQuery === topic ? '#fff' : 'var(--ink3)',
                    borderBottom: `1px solid ${searchQuery === topic ? '#fff' : 'var(--border3)'}`
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Search Results Area */}
            <div style={{ marginTop: '40px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '6px' }} className="custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <div style={{ 
                      fontFamily: 'var(--mono)', 
                      fontSize: '10px', 
                      letterSpacing: '0.12em', 
                      color: 'var(--red)', 
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      paddingBottom: '8px',
                      textTransform: 'uppercase'
                    }}>
                      Archive Matches ({results.length})
                    </div>
                    {results.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          paddingBottom: '16px',
                        }}
                      >
                        <Link 
                          href={getRoute(item.category, item.slug)}
                          onClick={onClose}
                          style={{ textDecoration: 'none', display: 'block' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ 
                              fontFamily: 'var(--mono)', 
                              fontSize: '9px', 
                              fontWeight: 700, 
                              letterSpacing: '0.15em', 
                              color: 'var(--red)',
                              textTransform: 'uppercase',
                              border: '1px solid var(--red)',
                              padding: '2px 8px',
                              borderRadius: '2px'
                            }}>
                              {item.category}
                            </span>
                            {item.views !== undefined && (
                              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--ink4)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <BookOpen size={10} /> {item.views} views
                              </span>
                            )}
                            {item.createdAt && (
                              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--ink4)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                          <h3 style={{ 
                            fontFamily: 'var(--serif)', 
                            fontSize: '20px', 
                            fontWeight: 500, 
                            color: '#fff', 
                            margin: '0 0 6px 0',
                            transition: 'color 0.2s',
                          }}
                          className="search-result-title"
                          >
                            {item.title}
                          </h3>
                          {item.excerpt && (
                            <p style={{ 
                              fontFamily: 'var(--body)', 
                              fontSize: '13px', 
                              lineHeight: '1.6', 
                              color: 'var(--ink2)', 
                              margin: 0 
                            }}>
                              {item.excerpt}
                            </p>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : searchQuery.trim() && !isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ 
                      textAlign: 'center', 
                      padding: '40px 0', 
                      fontFamily: 'var(--serif)', 
                      color: 'var(--ink4)',
                      fontStyle: 'italic'
                    }}
                  >
                    No articles or documents found matching "{searchQuery}"
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

          </div>

          <style jsx global>{`
            .search-result-title:hover {
              color: var(--red) !important;
              text-decoration: underline;
              text-decoration-color: rgba(197, 160, 89, 0.4);
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.02);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: var(--border3);
              border-radius: 2px;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
