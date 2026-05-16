'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import { 
  Plus, Edit2, Trash2, X, Save, 
  FileText, Video, BookOpen, Layout, Phone, LogOut, Newspaper as NewspaperIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000/api';

type Section = 'news' | 'blog' | 'docs' | 'newspaper' | 'pages';

interface ContentItem {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  // Newspaper specific
  issueDate?: string;
  pdfUrl?: string;
  description?: string;
  // Page specific
  slug?: string;
  metadata?: Record<string, string>;
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>('news');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<ContentItem>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    imageUrl: '',
    slug: '',
    issueDate: new Date().toISOString().split('T')[0],
    pdfUrl: '',
    description: ''
  });
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  const fetchItems = useCallback(async () => {
    let url = `${API_BASE_URL}/news`;
    if (activeSection === 'blog') url = `${API_BASE_URL}/news?category=Blog`;
    else if (activeSection === 'docs') url = `${API_BASE_URL}/news?category=Documentary`;
    else if (activeSection === 'news') url = `${API_BASE_URL}/news?category=News`;
    else if (activeSection === 'newspaper') url = `${API_BASE_URL}/newspapers`;
    else if (activeSection === 'pages') url = `${API_BASE_URL}/pages`;

    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) handleLogout();
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  }, [activeSection, token, handleLogout]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token, fetchItems]);

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      ...item,
      issueDate: item.issueDate ? new Date(item.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    let url = `${API_BASE_URL}/news/${id}`;
    if (activeSection === 'newspaper') url = `${API_BASE_URL}/newspapers/${id}`;
    if (activeSection === 'pages') {
      alert('Pages cannot be deleted, only edited.');
      return;
    }

    try {
      const res = await fetch(url, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) handleLogout();
      fetchItems();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let url = `${API_BASE_URL}/news`;
    let method = editingItem ? 'PUT' : 'POST';

    if (activeSection === 'newspaper') {
      url = editingItem ? `${API_BASE_URL}/newspapers/${editingItem._id}` : `${API_BASE_URL}/newspapers`;
    } else if (activeSection === 'pages') {
      url = `${API_BASE_URL}/pages`;
      method = 'POST'; // upsert
    } else {
      url = editingItem ? `${API_BASE_URL}/news/${editingItem._id}` : `${API_BASE_URL}/news`;
      // Auto-set category based on section
      if (!editingItem) {
        if (activeSection === 'blog') formData.category = 'Blog';
        if (activeSection === 'docs') formData.category = 'Documentary';
        if (activeSection === 'news') formData.category = 'News';
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ title: '', excerpt: '', content: '', category: '', imageUrl: '', slug: '', pdfUrl: '', description: '' });
        fetchItems();
      }
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const sections = [
    { id: 'news', label: 'News', icon: <FileText size={18} /> },
    { id: 'blog', label: 'Blog', icon: <BookOpen size={18} /> },
    { id: 'docs', label: 'Documentaries', icon: <Video size={18} /> },
    { id: 'newspaper', label: 'Newspaper', icon: <NewspaperIcon size={18} /> },
    { id: 'pages', label: 'Pages (About/Contact)', icon: <Layout size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'var(--bg2)', borderRight: '1px solid var(--border3)', padding: '40px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 32px', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '24px', color: 'var(--gold)' }}>Admin Panel</h2>
          <p style={{ fontSize: '12px', color: 'var(--ink4)', marginTop: '4px' }}>Udant Martand Editorial</p>
        </div>
        
        <nav style={{ flex: 1 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as Section)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 32px',
                background: activeSection === s.id ? 'var(--bg)' : 'transparent',
                color: activeSection === s.id ? 'var(--gold)' : 'var(--ink3)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                borderLeft: activeSection === s.id ? '4px solid var(--gold)' : '4px solid transparent',
              }}
            >
              {s.icon}
              <span style={{ fontWeight: activeSection === s.id ? 600 : 400 }}>{s.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '0 32px' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px 0', 
              color: 'var(--red)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <Header onSearchOpen={() => setIsSearchOpen(true)} />

        <main className="wrap" style={{ padding: '60px 44px', maxWidth: '1200px', width: '100%' }}>
          <div className="sec-head">
            <span className="sec-tag">{sections.find(s => s.id === activeSection)?.label} Management</span>
            <div className="sec-line"></div>
            <button 
              className="btn btn-primary" 
              style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              onClick={() => {
                setEditingItem(null);
                setFormData({ 
                  title: '', excerpt: '', content: '', category: '', imageUrl: '', 
                  slug: '', pdfUrl: '', description: '', issueDate: new Date().toISOString().split('T')[0] 
                });
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} /> New {activeSection === 'pages' ? 'Page' : 'Entry'}
            </button>
          </div>

          <div className="admin-table-container" style={{ border: '1px solid var(--border3)', background: 'var(--bg2)', borderRadius: '4px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border3)', color: 'var(--ink4)', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>
                  <th style={{ padding: '16px 20px' }}>{activeSection === 'pages' ? 'Slug / Title' : 'Title'}</th>
                  <th style={{ padding: '16px 20px' }}>{activeSection === 'newspaper' ? 'Issue Date' : 'Type'}</th>
                  <th style={{ padding: '16px 20px', width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: 'var(--ink4)' }}>No items found in this section.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item._id || item.slug} style={{ borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500, color: 'var(--ink)' }}>
                        {activeSection === 'pages' ? `${item.slug} - ${item.title}` : item.title}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--ink3)', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                        {activeSection === 'newspaper' ? new Date(item.issueDate!).toLocaleDateString() : (item.category || activeSection)}
                      </td>
                      <td style={{ padding: '16px 20px', display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(item)}
                          style={{ background: 'none', border: 'none', color: 'var(--ink4)', cursor: 'pointer', transition: 'color 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.color = 'var(--gold)'}
                          onMouseOut={(e) => e.currentTarget.style.color = 'var(--ink4)'}
                        >
                          <Edit2 size={16} />
                        </button>
                        {activeSection !== 'pages' && (
                          <button 
                            onClick={() => handleDelete(item._id!)}
                            style={{ background: 'none', border: 'none', color: 'var(--ink4)', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--red)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--ink4)'}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(8, 6, 3, 0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="modal-box" 
              style={{ background: 'var(--bg2)', border: '1px solid var(--border3)', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg2)', zIndex: 10 }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '24px' }}>
                  {editingItem ? 'Edit' : 'Create New'} {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                    />
                  </div>

                  {activeSection === 'pages' ? (
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Slug (about or contact)</label>
                      <input 
                        type="text" 
                        required
                        disabled={!!editingItem}
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        style={{ width: '100%', background: editingItem ? 'var(--bg2)' : 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                      />
                    </div>
                  ) : activeSection === 'newspaper' ? (
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Issue Date</label>
                      <input 
                        type="date" 
                        required
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Category</label>
                      <select 
                        value={formData.category || (activeSection === 'news' ? 'News' : activeSection === 'blog' ? 'Blog' : 'Documentary')}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }}
                      >
                        <option value="News">News</option>
                        <option value="Blog">Blog</option>
                        <option value="Documentary">Documentary</option>
                      </select>
                    </div>
                  )}
                </div>

                {activeSection !== 'newspaper' && (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>
                      {activeSection === 'pages' ? 'Content (HTML supported)' : 'Excerpt / Summary'}
                    </label>
                    <textarea 
                      rows={activeSection === 'pages' ? 10 : 2}
                      required
                      value={activeSection === 'pages' ? formData.content : formData.excerpt}
                      onChange={(e) => setFormData(activeSection === 'pages' ? { ...formData, content: e.target.value } : { ...formData, excerpt: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', resize: 'vertical', borderRadius: '4px' }} 
                    ></textarea>
                  </div>
                )}

                {activeSection !== 'pages' && activeSection !== 'newspaper' && (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Full Content</label>
                    <textarea 
                      rows={6}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', resize: 'vertical', borderRadius: '4px' }} 
                    ></textarea>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>
                      {activeSection === 'newspaper' ? 'Thumbnail Image URL' : 'Featured Image URL'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                    />
                  </div>
                  {activeSection === 'newspaper' && (
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>PDF URL</label>
                      <input 
                        type="text" 
                        required
                        value={formData.pdfUrl}
                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                      />
                    </div>
                  )}
                </div>

                {activeSection === 'newspaper' && (
                  <div className="form-group" style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Description</label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                    ></textarea>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', position: 'sticky', bottom: 0, background: 'var(--bg2)', padding: '16px 0', borderTop: '1px solid var(--border3)' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: '8px', padding: '14px' }}>
                    <Save size={16} /> {editingItem ? 'Update' : 'Publish'} {activeSection}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
