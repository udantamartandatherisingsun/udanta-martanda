'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap" style={{ padding: 0 }}>
        <div className="foot-main">
          <div className="foot-brand">
            <div className="f-pre" style={{ 
              fontFamily: 'var(--hindi)', 
              fontSize: '11px', 
              letterSpacing: '.3em', 
              color: 'var(--ink4)',
              marginBottom: '10px'
            }}>उदन्त मार्तण्ड</div>
            <h2 style={{ 
              fontFamily: 'var(--serif)', 
              fontSize: '32px', 
              fontWeight: 600, 
              color: 'var(--ink)',
              lineHeight: 1
            }}>Udant Martand</h2>
            <p style={{ 
              fontFamily: 'var(--body)', 
              fontSize: '14px', 
              color: 'var(--ink3)',
              marginTop: '15px'
            }}>
              India&apos;s Heritage<br />
              in Print &amp; Digital<br /><br />
              Est. 1826 · Reborn Digital 2026<br />
              Indore, Madhya Pradesh, India<br /><br />
              GST: 23DFAPK0323C1ZE@<br />
              <a href="/Udyam_Registration_Certificate.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>MSME Certificate</a>
            </p>
          </div>
          
          <div className="foot-col">
            <h3 style={{ 
              fontFamily: 'var(--mono)', 
              fontSize: '10px', 
              letterSpacing: '.15em', 
              textTransform: 'uppercase', 
              color: 'var(--ink)',
              marginBottom: '18px'
            }}>Sections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>News</Link>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>Documentaries</Link>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>E-Newspaper</Link>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>Blog</Link>
            </div>
          </div>

          <div className="foot-col">
            <h3 style={{ 
              fontFamily: 'var(--mono)', 
              fontSize: '10px', 
              letterSpacing: '.15em', 
              textTransform: 'uppercase', 
              color: 'var(--ink)',
              marginBottom: '18px'
            }}>Company</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>About Us</Link>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>Our Team</Link>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>Contact</Link>
              <Link href="#" className="sec-aside" style={{ color: 'var(--ink3)' }}>Advertise</Link>
              <a href="https://www.youtube.com/channel/UCPtOt_XNkZGKjKpoL2AQdLQ" target="_blank" rel="noreferrer" className="sec-aside" style={{ color: 'var(--ink3)' }}>YouTube</a>
            </div>
          </div>

          <div className="foot-col">
            <h3 style={{ 
              fontFamily: 'var(--mono)', 
              fontSize: '10px', 
              letterSpacing: '.15em', 
              textTransform: 'uppercase', 
              color: 'var(--ink)',
              marginBottom: '18px'
            }}>Legal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/privacy" className="sec-aside" style={{ color: 'var(--ink3)' }}>Privacy Policy</Link>
              <Link href="/terms" className="sec-aside" style={{ color: 'var(--ink3)' }}>Terms of Use</Link>
              <Link href="/sitemap" className="sec-aside" style={{ color: 'var(--ink3)' }}>Sitemap</Link>
              <a href="/rss.xml" className="sec-aside" style={{ color: 'var(--ink3)' }}>RSS Feed</a>
            </div>
          </div>
        </div>
      </div>

      <div className="foot-base wrap" style={{ paddingLeft: '44px', paddingRight: '44px' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink4)' }}>
          © 2026 Udant Martand · उदन्त मार्तण्ड · All rights reserved
        </p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--ink4)' }}>
          Designed &amp; built by <a href="https://novaedgedigitallabs.tech" style={{ color: 'var(--ink3)' }}>NovaEdge Digital Labs</a> · Indore, MP
        </p>
      </div>
    </footer>
  );
}
