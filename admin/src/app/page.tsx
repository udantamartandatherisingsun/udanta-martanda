'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import RichTextEditor from '@/components/RichTextEditor';
import { 
  Plus, Edit2, Trash2, X, Save, 
  FileText, Video, BookOpen, Layout, Phone, LogOut, Newspaper as NewspaperIcon,
  Database, Download, Upload, AlertTriangle, CheckCircle2, RefreshCw,
  Lock, Unlock, Key, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? `${window.location.origin}/_/backend/api` : 'http://localhost:5000/api');

type Section = 'news' | 'blog' | 'docs' | 'newspaper' | 'pages' | 'backup';

interface ContentItem {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
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
    videoUrl: '',
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
    if (activeSection === 'backup') return;
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
    else if (activeSection === 'pages') url = `${API_BASE_URL}/pages/${id}`;

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
        setFormData({ title: '', excerpt: '', content: '', category: '', imageUrl: '', videoUrl: '', slug: '', pdfUrl: '', description: '' });
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
    { id: 'backup', label: 'Backup & Restore', icon: <Database size={18} /> },
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
            {activeSection !== 'backup' && (
              <button 
                className="btn btn-primary" 
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => {
                  setEditingItem(null);
                  setFormData({ 
                    title: '', excerpt: '', content: '', category: '', imageUrl: '', videoUrl: '',
                    slug: '', pdfUrl: '', description: '', issueDate: new Date().toISOString().split('T')[0] 
                  });
                  setIsModalOpen(true);
                }}
              >
                <Plus size={16} /> New {activeSection === 'pages' ? 'Page' : 'Entry'}
              </button>
            )}
          </div>

          {activeSection === 'backup' ? (
            <BackupRestorePanel token={token} handleLogout={handleLogout} />
          ) : (
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
                          <button 
                            onClick={() => handleDelete(item._id || item.slug || '')}
                            style={{ background: 'none', border: 'none', color: 'var(--ink4)', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--red)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--ink4)'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
                      {activeSection === 'pages' ? 'Content (Rich Text)' : 'Excerpt / Summary'}
                    </label>
                    {activeSection === 'pages' ? (
                      <RichTextEditor
                        value={formData.content || ''}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        placeholder="Write beautiful pages content..."
                      />
                    ) : (
                      <textarea 
                        rows={2}
                        required
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', resize: 'vertical', borderRadius: '4px' }} 
                      ></textarea>
                    )}
                  </div>
                )}

                {activeSection !== 'pages' && activeSection !== 'newspaper' && (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Full Content (Rich Text)</label>
                    <RichTextEditor
                      value={formData.content || ''}
                      onChange={(val) => setFormData({ ...formData, content: val })}
                      placeholder="Write beautiful article content..."
                    />
                  </div>
                )}

                {activeSection === 'docs' && (
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Video URL (YouTube Embed or Link)</label>
                    <input 
                      type="text" 
                      value={formData.videoUrl || ''}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g., https://www.youtube.com/embed/... or https://youtu.be/..."
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px' }} 
                    />
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

function BackupRestorePanel({ token, handleLogout }: { token: string | null; handleLogout: () => void }) {
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [loading, setLoading] = useState<'export' | 'import' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(false);

  // Security and encryption state variables
  const [encryptExport, setEncryptExport] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [showExportPassword, setShowExportPassword] = useState(false);

  const [isBackupEncrypted, setIsBackupEncrypted] = useState(false);
  const [importPassword, setImportPassword] = useState('');
  const [showImportPassword, setShowImportPassword] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleExport = async () => {
    if (!token) return;
    if (encryptExport && exportPassword.length < 6) {
      setStatus({ type: 'error', message: 'Encryption password must be at least 6 characters long.' });
      return;
    }

    setLoading('export');
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/backup/export`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          encrypt: encryptExport,
          password: encryptExport ? exportPassword : undefined
        })
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Export failed');
      }

      const resData = await res.json();
      const backupPayload = resData.backup;
      
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      const namePrefix = encryptExport ? 'udant-martand-encrypted-backup' : 'udant-martand-backup';
      a.download = `${namePrefix}-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus({ 
        type: 'success', 
        message: encryptExport 
          ? 'Database backup encrypted and downloaded successfully! Keep your password safe.' 
          : 'Database backup file exported and downloaded successfully!' 
      });
      setExportPassword('');
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Failed to export database.' });
    } finally {
      setLoading(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsBackupEncrypted(false);
      setImportPassword('');
      setFileError('');
      
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const backupPayload = json.backup ? json.backup : json;
        
        if (backupPayload.encrypted) {
          setIsBackupEncrypted(true);
        } else if (!backupPayload.data || !backupPayload.data.news || !backupPayload.data.newspapers || !backupPayload.data.pages) {
          setFileError('Invalid backup file format: Missing database content structure.');
        }
      } catch (err) {
        setFileError('Failed to parse file as JSON. Please ensure it is a valid backup file.');
      }
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedFile || fileError) return;

    if (isBackupEncrypted && !importPassword) {
      setStatus({ type: 'error', message: 'This backup file is encrypted. Decryption password is required.' });
      return;
    }

    const confirmMsg = clearExisting 
      ? 'WARNING: This will delete ALL current news, blogs, documentaries, newspapers, and pages, and restore from the backup file. Are you absolutely sure?'
      : 'Are you sure you want to import data from the backup file?';

    if (!confirm(confirmMsg)) return;

    setLoading('import');
    setStatus({ type: 'idle', message: '' });

    try {
      const fileText = await selectedFile.text();
      let backupData;
      try {
        backupData = JSON.parse(fileText);
      } catch (parseErr) {
        throw new Error('Invalid backup JSON format.');
      }

      const backupPayload = backupData.backup ? backupData.backup : backupData;

      const res = await fetch(`${API_BASE_URL}/backup/import`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          backup: backupPayload,
          password: isBackupEncrypted ? importPassword : undefined,
          mode: clearExisting ? 'overwrite' : 'merge'
        })
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || resData.message || 'Import failed');
      }

      const stats = resData.stats;
      const statsMsg = stats 
        ? `Stats: News/Blogs/Docs (inserted: ${stats.news?.inserted || 0}, updated: ${stats.news?.updated || 0}), ` +
          `Newspapers (inserted: ${stats.newspapers?.inserted || 0}, updated: ${stats.newspapers?.updated || 0}), ` +
          `Pages (inserted: ${stats.pages?.inserted || 0}, updated: ${stats.pages?.updated || 0})` +
          (stats.users ? `, Users (inserted: ${stats.users.inserted || 0}, updated: ${stats.users.updated || 0}).` : '.')
        : `Database restore complete!`;

      setStatus({ 
        type: 'success', 
        message: `${resData.message || 'Database restore complete!'} ${statsMsg}`
      });
      setSelectedFile(null);
      setImportPassword('');
      setIsBackupEncrypted(false);
      const fileInput = document.getElementById('backup-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'Failed to import backup.' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '20px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1.2s linear infinite;
        }
      `}} />

      {status.type !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px 20px',
            borderRadius: '4px',
            border: `1px solid ${status.type === 'success' ? '#1b4332' : 'var(--red)'}`,
            background: status.type === 'success' ? '#081c15' : '#1a0d0d',
            color: status.type === 'success' ? '#d8f3dc' : '#ffccd5',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px'
          }}
        >
          {status.type === 'success' ? <CheckCircle2 size={20} style={{ color: '#52b788' }} /> : <AlertTriangle size={20} style={{ color: 'var(--red)' }} />}
          <div style={{ flex: 1 }}>{status.message}</div>
          <button onClick={() => setStatus({ type: 'idle', message: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}>
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Export Panel */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border3)', borderTop: '4px solid var(--gold)', borderRadius: '4px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Database size={24} style={{ color: 'var(--gold)' }} />
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--ink)' }}>Export Website Backup</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: '1.6', marginBottom: '24px' }}>
              Generate and download a comprehensive backup file containing all news articles, blog posts, documentaries, digital newspapers, and customized static pages. 
              Keep this file safe to restore the site's state at any point in time.
            </p>

            {/* Encryption toggle */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <input 
                  type="checkbox" 
                  id="encrypt-export-checkbox"
                  checked={encryptExport}
                  onChange={(e) => setEncryptExport(e.target.checked)}
                  style={{ accentColor: 'var(--gold)', cursor: 'pointer' }}
                />
                <label htmlFor="encrypt-export-checkbox" style={{ fontSize: '13px', color: 'var(--ink2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', userSelect: 'none' }}>
                  {encryptExport ? <Lock size={14} style={{ color: 'var(--gold)' }} /> : <Unlock size={14} style={{ color: 'var(--ink3)' }} />}
                  Encrypt backup file (AES-256-CBC)
                </label>
              </div>

              <AnimatePresence>
                {encryptExport && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '4px 0 12px 0' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink3)', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'var(--mono)' }}>
                        Encryption Password
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type={showExportPassword ? "text" : "password"} 
                          value={exportPassword}
                          onChange={(e) => setExportPassword(e.target.value)}
                          placeholder="Min 6 characters required"
                          required={encryptExport}
                          style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '10px 40px 10px 12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px', fontSize: '13px' }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowExportPassword(!showExportPassword)}
                          style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {showExportPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            disabled={loading !== null}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              gap: '10px', 
              padding: '14px', 
              background: 'var(--gold)', 
              color: 'var(--bg)',
              fontWeight: 600,
              opacity: loading !== null ? 0.6 : 1,
              cursor: loading !== null ? 'not-allowed' : 'pointer'
            }}
          >
            {loading === 'export' ? (
              <>
                <RefreshCw size={16} className="spin-animation" /> Exporting...
              </>
            ) : (
              <>
                <Download size={16} /> Generate & Download Backup
              </>
            )}
          </button>
        </div>

        {/* Import Panel */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border3)', borderTop: '4px solid var(--red)', borderRadius: '4px', padding: '30px' }}>
          <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Upload size={24} style={{ color: 'var(--red)' }} />
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--ink)' }}>Restore from Backup</h3>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--ink2)', lineHeight: '1.6', marginBottom: '20px' }}>
                Upload a JSON backup file to restore website content. Restoring will add all articles, digital newspaper editions, pages, and users back to the database.
              </p>

              {/* File warning / error message */}
              {fileError && (
                <div style={{ fontSize: '12px', color: '#ffccd5', background: '#1a0d0d', padding: '12px 14px', borderRadius: '4px', border: '1px solid var(--red)', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--red)', marginTop: '2px', flexShrink: 0 }} />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Encryption Detection & Password Field */}
              <AnimatePresence>
                {isBackupEncrypted && !fileError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border3)', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--gold)', fontSize: '13px' }}>
                        <Lock size={16} />
                        <span style={{ fontWeight: 600 }}>Encrypted Backup Detected</span>
                      </div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink3)', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'var(--mono)' }}>
                        Decryption Password
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input 
                          type={showImportPassword ? "text" : "password"} 
                          value={importPassword}
                          onChange={(e) => setImportPassword(e.target.value)}
                          placeholder="Enter password to decrypt file"
                          required={isBackupEncrypted}
                          style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border3)', padding: '10px 40px 10px 12px', color: 'var(--ink)', outline: 'none', borderRadius: '4px', fontSize: '13px' }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowImportPassword(!showImportPassword)}
                          style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {showImportPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* File input area */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="backup-file-input"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    border: '1px dashed var(--border3)',
                    background: 'var(--bg)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--ink3)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border3)'}
                >
                  <Upload size={20} style={{ color: 'var(--ink3)', marginBottom: '8px' }} />
                  <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--ink3)', textTransform: 'uppercase' }}>
                    {selectedFile ? selectedFile.name : 'Select Backup JSON File'}
                  </span>
                  {selectedFile && (
                    <span style={{ fontSize: '11px', color: 'var(--ink4)', marginTop: '4px' }}>
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </label>
                <input 
                  type="file" 
                  id="backup-file-input" 
                  accept=".json"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Checkbox for clean restore */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
                <input 
                  type="checkbox" 
                  id="clear-db-checkbox"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  style={{ marginTop: '4px', accentColor: 'var(--red)', cursor: 'pointer' }}
                />
                <label htmlFor="clear-db-checkbox" style={{ fontSize: '12px', color: 'var(--ink3)', cursor: 'pointer', userSelect: 'none', lineHeight: '1.4' }}>
                  <strong style={{ color: '#ffccd5' }}>Clear existing content:</strong> Remove all current news, blogs, newspapers, and pages before importing. (Avoids duplicate items)
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading !== null || !selectedFile || !!fileError}
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                gap: '10px', 
                padding: '14px', 
                background: (selectedFile && !fileError) ? 'var(--red)' : 'var(--bg3)', 
                color: (selectedFile && !fileError) ? '#fff' : 'var(--ink4)',
                borderColor: (selectedFile && !fileError) ? 'var(--red)' : 'var(--border3)',
                fontWeight: 600,
                opacity: (loading !== null || !selectedFile || !!fileError) ? 0.6 : 1,
                cursor: (loading !== null || !selectedFile || !!fileError) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading === 'import' ? (
                <>
                  <RefreshCw size={16} className="spin-animation" /> Restoring...
                </>
              ) : (
                <>
                  <Database size={16} /> Restore Database
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
