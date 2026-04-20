"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// นำเข้า CSS เพื่อให้ Tailwind ทำงาน
import "../app/globals.css"; 

import { 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  CheckBadgeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// --- 1. เพิ่มคอมโพเนนต์ Navbar ไว้ในไฟล์นี้เลยเพื่อความชัวร์ ---
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
        {/* โลโก้ตัว O สีทองตามแบบเพื่อน */}
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
        <button className="text-xs font-semibold text-gray-600 hover:text-black">Sign in</button>
        <button className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-gray-800 px-4 py-2 rounded-md text-xs font-bold shadow-sm hover:opacity-90 transition-opacity">
          Get API key
        </button>
      </div>
    </nav>
  );
};

// --- 2. คอมโพเนนต์หน้า Support หลัก ---
const SupportPage = () => {
  const iconStyle = { width: '24px', height: '24px' };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
      {/* เรียกใช้ Navbar ที่เราสร้างไว้ข้างบน */}
      <Navbar />
      
      {/* --- Main Content --- */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex-grow">
        
        {/* --- Header Section --- */}
        <div className="mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
            Support
          </span>
          <h1 className="text-5xl font-bold text-[#0B152A] mb-4 tracking-tight">
            We've got your back
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            From quick questions to enterprise integration help — pick the channel that fits.
          </p>
        </div>

        {/* --- Contact Cards (Grid 3 Cols) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Developer Chat */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
              <ChatBubbleLeftRightIcon 
                className="text-slate-400 group-hover:text-amber-600" 
                style={iconStyle} 
              />
            </div>
            <h3 className="text-lg font-bold text-[#0B152A] mb-2">Developer chat</h3>
            <p className="text-sm text-slate-500 mb-6">Live response within 15 min on Pro plan.</p>
            <button className="flex items-center text-xs font-bold text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors">
              Slack Connect <ChevronRightIcon style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
            </button>
          </div>

          {/* Email Support */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
              <EnvelopeIcon 
                className="text-slate-400 group-hover:text-amber-600" 
                style={iconStyle} 
              />
            </div>
            <h3 className="text-lg font-bold text-[#0B152A] mb-2">Email support</h3>
            <p className="text-sm text-slate-500 mb-6">support@aurumindex.io</p>
            <button className="flex items-center text-xs font-bold text-amber-600 uppercase tracking-widest">
              24H RESPONSE
            </button>
          </div>

          {/* Status Page */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors">
              <CheckBadgeIcon 
                className="text-slate-400 group-hover:text-amber-600" 
                style={iconStyle} 
              />
            </div>
            <h3 className="text-lg font-bold text-[#0B152A] mb-2">Status page</h3>
            <p className="text-sm text-slate-500 mb-6">All systems operational</p>
            <button className="flex items-center text-xs font-bold text-amber-600 uppercase tracking-widest">
              99.99% UPTIME
            </button>
          </div>
        </div>

        {/* --- Ticket Form Section --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#0B152A] mb-2">Open a ticket</h2>
              <p className="text-slate-500 text-sm">Average first response: under 4 hours.</p>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input 
                    type="email" 
                    placeholder="jane@company.com" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subject</label>
                <input 
                  type="text" 
                  placeholder="WebSocket disconnects after 30s" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea 
                  rows="5" 
                  placeholder="Describe your issue, include API key prefix and timestamps." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0B152A] hover:bg-slate-800 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Submit ticket
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#050F1F] text-slate-400 py-16 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">
                A
              </div>
              <span className="font-bold text-xl tracking-tight text-white">AurumIndex</span>
            </div>
            <p className="text-[13px] leading-relaxed max-w-[240px] text-slate-400">
              The institutional-grade Gold Market Index & API provider for developers, analysts and shops.
            </p>
          </div>
          
          {[
            {
              title: 'Product',
              links: ['Pricing', 'Dashboard', 'Market Sentiment'],
            },
            {
              title: 'Developers',
              links: ['Documentation', 'API Reference', 'Status'],
            },
            {
              title: 'Company',
              links: ['API Support', 'Terms', 'Privacy'],
            },
          ].map((column) => (
            <div key={column.title}>
              <h4 className="text-amber-500 text-sm font-bold mb-6 uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="text-[13px] space-y-4">
                {column.links.map((link) => (
                  <li 
                    key={link} 
                    className="hover:text-white cursor-pointer transition-colors text-slate-400"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium tracking-wider uppercase text-slate-500">
          <p>© 2026 AurumIndex Co., Ltd. — All gold prices are reference data.</p>
          <p className="hover:text-slate-300 transition-colors">Index data licensed by LBMA partners.</p>
        </div>
      </footer>
    </div>
  );
};

export default SupportPage;