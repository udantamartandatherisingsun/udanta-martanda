'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 400px)', padding: '100px 20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-card"
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            background: 'var(--bg2)', 
            border: '1px solid var(--border3)', 
            padding: '40px' 
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="sec-tag" style={{ display: 'block', marginBottom: '12px' }}>Access Control</span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '32px', color: 'var(--ink)' }}>Admin Login</h1>
            <div className="sec-line" style={{ margin: '20px auto' }}></div>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid var(--red)', 
                  color: 'var(--red)', 
                  padding: '12px', 
                  fontSize: '14px', 
                  marginBottom: '24px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@udantmartand.in"
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none' }} 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink4)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--mono)' }}>Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border3)', padding: '12px', color: 'var(--ink)', outline: 'none' }} 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', gap: '8px', height: '48px' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn size={18} /> Enter Dashboard
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--ink4)', textAlign: 'center', fontFamily: 'var(--mono)' }}>
            Restricted area for Udant Martand staff only.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
