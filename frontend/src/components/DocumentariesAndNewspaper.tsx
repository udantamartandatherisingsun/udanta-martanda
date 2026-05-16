'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://localhost:5000/api';

interface DocItem {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface NewspaperItem {
  _id: string;
  title: string;
  issueDate: string;
  pdfUrl: string;
  imageUrl: string;
  description: string;
}

export default function DocumentariesAndNewspaper() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [newspapers, setNewspapers] = useState<NewspaperItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, npRes] = await Promise.all([
          fetch(`${API_BASE_URL}/news?category=Documentary`),
          fetch(`${API_BASE_URL}/newspapers`)
        ]);

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          setDocs(docsData.slice(0, 3)); // Only show top 3
        }

        if (npRes.ok) {
          const npData = await npRes.json();
          setNewspapers(npData.slice(0, 3)); // Only show top 3
        }
      } catch (err) {
        console.error('Failed to fetch documentaries or newspapers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.5 }}>
        <span className="mono">Loading visual stories...</span>
      </div>
    );
  }

  return (
    <div className="two-col">
      {/* Documentaries */}
      <div className="col-pane">
        <div className="sec-head" style={{ marginTop: 0 }}>
          <span className="sec-tag">Documentaries</span>
          <div className="sec-line"></div>
          <a href="/documentaries" className="sec-link">All →</a>
        </div>
        
        {docs.length === 0 ? (
          <p className="lora" style={{ opacity: 0.5, padding: '2rem 0' }}>No documentaries available yet.</p>
        ) : (
          docs.map((doc) => (
            <motion.article 
              key={doc._id} 
              className="doc-item"
              whileHover={{ x: 5 }}
            >
              <div className="doc-thumb">
                {doc.imageUrl ? (
                  <img 
                    src={doc.imageUrl} 
                    alt={doc.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-paper)' }}></div>
                )}
                <div className="fig-texture"></div>
                <div className="play"></div>
              </div>
              <div className="doc-info">
                <div className="cat" style={{ fontSize: '10px', color: 'var(--ink3)', marginBottom: '4px' }}>
                  {doc.category} · {new Date(doc.createdAt).getFullYear()}
                </div>
                <h3>{doc.title}</h3>
                <div className="meta" style={{ fontSize: '10px', color: 'var(--ink4)' }}>
                  {doc.excerpt.slice(0, 80)}...
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* Newspaper */}
      <div className="col-pane">
        <div className="sec-head" style={{ marginTop: 0 }}>
          <span className="sec-tag">E-Newspaper</span>
          <div className="sec-line"></div>
          <a href="/newspaper" className="sec-link">Archive →</a>
        </div>
        
        {newspapers.length === 0 ? (
          <p className="lora" style={{ opacity: 0.5, padding: '2rem 0' }}>No editions available yet.</p>
        ) : (
          newspapers.map((np) => (
            <motion.article 
              key={np._id} 
              className="np-item"
              whileHover={{ x: 5 }}
            >
              <div className="np-thumb">
                {np.imageUrl ? (
                  <img src={np.imageUrl} alt={np.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="np-lines">
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>
                )}
              </div>
              <div className="np-info">
                <div className="meta" style={{ fontSize: '10px', color: 'var(--ink4)', marginBottom: '4px' }}>
                  {new Date(np.issueDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h3>{np.title}</h3>
                <p style={{ fontSize: '12px', marginBottom: '6px' }}>{np.description?.slice(0, 100)}...</p>
                <a href={np.pdfUrl} target="_blank" rel="noopener noreferrer" className="read-link" style={{ fontSize: '9px' }}>Read PDF →</a>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}
