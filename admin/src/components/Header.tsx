'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ onSearchOpen }: { onSearchOpen: () => void }) {
  const pathname = usePathname();
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: 'http://localhost:3000', label: 'View Public Site' },
  ];


  return (
    <header>
      <div className="header-util">
        <div className="util-left">
          {today} · INDORE EDITION
        </div>
        <div className="util-right">
          <a href="#">Newsletter</a>
          <a href="#">E-Newspaper</a>
        </div>


      </div>

      <div className="masthead">
        <div className="mast-rules-top">
          <div className="mr1"></div>
          <div className="mr2"></div>
        </div>
        
        <div className="mast-pre">उदन्त मार्तण्ड</div>
        <h1 className="mast-title">
          Udant Martand
          <span className="hindi-sub">सत्य और स्वतंत्रता का उदघोष</span>
        </h1>
        <div className="mast-tagline">Independent Journalism Since 1826</div>

        <div className="mast-rules-bot">
          <div className="mr2"></div>
          <div className="mr3"></div>
        </div>
      </div>

      <nav className="main-nav">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={pathname === link.href ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
        
        <div className="nav-right">
          <div className="nav-icon" onClick={onSearchOpen}>
            <Search size={14} />
            <span>Search</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
