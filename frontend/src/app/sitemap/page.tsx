import Link from 'next/link';

export default function Sitemap() {
  return (
    <div style={{ maxWidth: '800px', margin: '100px auto', padding: '0 20px', fontFamily: 'var(--body)' }}>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '3rem', marginBottom: '30px' }}>Sitemap</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', lineHeight: '2' }}>
        <div>
          <h2 style={{ color: 'var(--ink)', borderBottom: '1px solid var(--border3)', paddingBottom: '10px' }}>Main</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link href="/" style={{ color: 'var(--ink2)' }}>Home</Link></li>
            <li><Link href="/contact" style={{ color: 'var(--ink2)' }}>Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h2 style={{ color: 'var(--ink)', borderBottom: '1px solid var(--border3)', paddingBottom: '10px' }}>News &amp; Categories</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link href="/news/bengal-hindi-200-years" style={{ color: 'var(--ink2)' }}>200 Years of Hindi in Bengal</Link></li>
          </ul>
        </div>
        <div>
          <h2 style={{ color: 'var(--ink)', borderBottom: '1px solid var(--border3)', paddingBottom: '10px' }}>Legal</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link href="/privacy" style={{ color: 'var(--ink2)' }}>Privacy Policy</Link></li>
            <li><Link href="/terms" style={{ color: 'var(--ink2)' }}>Terms of Use</Link></li>
            <li><Link href="/sitemap" style={{ color: 'var(--ink2)' }}>Sitemap</Link></li>
            <li><a href="/rss.xml" style={{ color: 'var(--ink2)' }}>RSS Feed</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
