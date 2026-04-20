"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import "../app/globals.css";

import { 
  BookOpenIcon, 
  CommandLineIcon, 
  BoltIcon, 
  ArrowPathIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

// --- นำโค้ด Navbar มาวางไว้ที่นี่เพื่อป้องกัน Error จากการหาไฟล์ไม่เจอ ---
const Navbar = () => {
  const pathname = usePathname();
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Docs', href: '/docs' },
    { name: 'Support', href: '/support' },
  ];
  
  return (
    <nav className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] rounded-md flex items-center justify-center font-bold text-black shadow-sm">O</div>
        <span className="font-bold text-lg text-[#0B152A]">Aurum<span className="text-amber-500">index</span></span>
      </div>
      <div className="hidden md:flex space-x-8 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`transition-colors font-bold ${
              pathname === link.href ? 'text-amber-500' : 'text-gray-600 hover:text-black'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-xs font-semibold text-gray-600">Sign in</button>
        <button className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-gray-800 px-4 py-2 rounded-md text-xs font-bold shadow-sm">
          Get API key
        </button>
      </div>
    </nav>
  );
};

// --- คอมโพเนนต์หน้า Docs หลัก ---
const Docs = () => {
  const iconStyle = { width: '20px', height: '20px' };

  const features = [
    {
      title: 'Quickstart',
      desc: 'Authenticate and make your first call in under 2 minutes.',
      icon: <BookOpenIcon style={iconStyle} className="text-amber-600" />,
    },
    {
      title: 'REST API',
      desc: 'Spot prices, historical OHLC, and shop rankings.',
      icon: <CommandLineIcon style={iconStyle} className="text-amber-600" />,
    },
    {
      title: 'WebSocket',
      desc: 'Subscribe to streaming ticks under 200 ms latency.',
      icon: <BoltIcon style={iconStyle} className="text-amber-600" />,
    },
    {
      title: 'Webhooks',
      desc: 'Event-driven callbacks for price and sentiment alerts.',
      icon: <ArrowPathIcon style={iconStyle} className="text-amber-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* เรียกใช้ Navbar ที่อยู่ด้านบน */}
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-12 text-left">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
            Documentation
          </span>
          <h1 className="text-5xl font-bold text-[#0B152A] mb-4 tracking-tight">
            Build with the gold-market API
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Everything you need to integrate real-time gold prices, shop rankings and sentiment scores into your product.
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group cursor-pointer">
              <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#0B152A] mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Block Section */}
        <div className="space-y-6 text-left">
          <h2 className="text-2xl font-bold text-[#0B152A]">Quickstart</h2>
          <p className="text-slate-500 text-sm">Fetch the latest XAU/THB spot price.</p>
          
          <div className="bg-[#0B152A] rounded-xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-[#071121]">
              <span className="text-xs font-mono text-slate-400">cURL</span>
              <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs">
                <DocumentDuplicateIcon style={{ width: '14px', height: '14px' }} />
                Copy
              </button>
            </div>
            
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
              <pre>
                <code>
                  <span className="text-slate-500">curl https://api.aurumindex.io/v1/spot \</span>{"\n"}
                  <span className="text-slate-500">  -H "Authorization: Bearer ai_live_..." \</span>{"\n"}
                  <span className="text-slate-500">  -H "Accept: application/json"</span>{"\n\n"}
                  <span className="text-amber-400"># Response</span>{"\n"}
                  {"{"}{"\n"}
                  {"  "}<span className="text-sky-400">"symbol"</span>: <span className="text-amber-200">"XAUTHB"</span>,{"\n"}
                  {"  "}<span className="text-sky-400">"price"</span>: <span className="text-amber-200">2398.40</span>,{"\n"}
                  {"  "}<span className="text-sky-400">"spread"</span>: <span className="text-amber-200">8</span>,{"\n"}
                  {"  "}<span className="text-sky-400">"ts"</span>: <span className="text-amber-200">"2025-04-18T08:01:23Z"</span>{"\n"}
                  {"}"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#050F1F] text-slate-400 py-16 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">A</div>
              <span className="font-bold text-xl tracking-tight">AurumIndex</span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-400 max-w-[240px]">
              The institutional-grade Gold Market Index & API provider for developers, analysts and shops.
            </p>
          </div>
          
          {[
            { title: 'Product', links: ['Pricing', 'Dashboard', 'Market Sentiment'] },
            { title: 'Developers', links: ['Documentation', 'API Reference', 'Status'] },
            { title: 'Company', links: ['API Support', 'Terms', 'Privacy'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-amber-500 text-sm font-bold mb-6 uppercase tracking-wider">{col.title}</h4>
              <ul className="text-[13px] space-y-4">
                {col.links.map(link => (
                  <li key={link} className="hover:text-white cursor-pointer transition-colors text-slate-400">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium tracking-tight text-slate-500">
          <p>© 2026 AurumIndex Co., Ltd. — All gold prices are reference data.</p>
          <p className="hover:text-slate-300 transition-colors uppercase tracking-widest">Index data licensed by LBMA partners.</p>
        </div>
      </footer>
    </div>
  );
};

export default Docs;