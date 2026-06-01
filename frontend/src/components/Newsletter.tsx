'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setStatus('loading');
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/newsletter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setEmail('');
          setTimeout(() => setStatus('idle'), 4000);
        } else {
          setStatus('error');
          setTimeout(() => setStatus('idle'), 2000);
        }
      } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <section className="newsletter" id="newsletter">
      <div className="nw-sup" style={{ 
        fontFamily: 'var(--mono)', 
        fontSize: '10px', 
        letterSpacing: '.2em', 
        textTransform: 'uppercase', 
        color: 'var(--ink4)',
        marginBottom: '10px'
      }}>Daily Digest</div>
      <h2>Stay Informed. Stay Independent.</h2>
      <p style={{ color: 'var(--ink3)', marginBottom: '24px' }}>Subscribe to our daily digest · प्रतिदिन समाचार सारांश पाएं</p>
      
      <form className="nw-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder={status === 'success' ? 'Thank you! Check your inbox.' : 'your@email.com'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ borderColor: status === 'error' ? 'var(--red)' : '' }}
        />
        <button 
          type="submit"
          style={{ 
            background: status === 'success' ? '#1A5C1A' : '',
            borderColor: status === 'success' ? '#1A5C1A' : ''
          }}
        >
          {status === 'loading' ? 'Sending...' : status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
        </button>
      </form>
    </section>
  );
}
