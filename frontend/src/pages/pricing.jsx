"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckIcon, 
  CommandLineIcon, 
  BoltIcon, 
  AcademicCapIcon 
} from '@heroicons/react/20/solid';
import "../app/globals.css";

// --- Navbar Component ---
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
          <Link key={link.name} href={link.href} className={`transition-colors font-bold ${pathname === link.href ? 'text-amber-500' : 'text-gray-600 hover:text-black'}`}>
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-xs font-semibold text-gray-600">Sign in</button>
        <button className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-gray-800 px-4 py-2 rounded-md text-xs font-bold shadow-sm">Get API key</button>
      </div>
    </nav>
  );
};

// --- Pricing Page Component ---
const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        {/* Header Section */}
        <div className="mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
            Pricing
          </span>
          <h1 className="text-5xl font-bold text-[#0B152A] mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Start free. Upgrade when you need richer data, lower latency or commercial use.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Free Tier */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col text-left">
            <div className="mb-6">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-400">
                <CommandLineIcon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free Tier</p>
              <h3 className="text-xl font-bold text-[#0B152A]">Public Widget</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#0B152A]">฿0</span>
              <span className="text-slate-400 text-sm ml-1">forever</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Embed gold prices on any site. Great for blogs and personal use.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Embeddable JS widget', 'Spot price preview (with watermark)', '15-minute price delay', 'Up to 1,000 widget loads / day'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-slate-600">
                  <CheckIcon className="w-4 h-4 text-amber-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-[#0B152A] text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors">
              Get embed code
            </button>
          </div>

          {/* Card 2: Plus Tier (Most Popular) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-amber-400 shadow-xl flex flex-col text-left relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
              Most popular
            </div>
            <div className="mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                <BoltIcon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Plus Tier</p>
              <h3 className="text-xl font-bold text-[#0B152A]">Developer Starter</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#0B152A]">฿39</span>
              <span className="text-slate-400 text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Build apps with shop comparison data and reliable price feeds.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Gold Shop Ranking API', 'Lowest spread / making charge feed', '5-minute refresh interval', '10,000 API calls / day', 'Email support'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-slate-600">
                  <CheckIcon className="w-4 h-4 text-amber-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-amber-500 text-black rounded-xl font-bold text-xs hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200">
              Start with Plus
            </button>
          </div>

          {/* Card 3: Pro Tier */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col text-left">
            <div className="mb-6">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-slate-400">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pro Tier</p>
              <h3 className="text-xl font-bold text-[#0B152A]">Analyst Data</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#0B152A]">฿99+</span>
              <span className="text-slate-400 text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Real-time intelligence for traders, funds and gold institutions.</p>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Real-time WebSocket API', 'Webhook events & alerts', 'Market Sentiment Score', 'Predictive trend models', '100,000+ API calls / day', 'Priority SLA support'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-slate-600">
                  <CheckIcon className="w-4 h-4 text-amber-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-[#0B152A] text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors">
              Talk to sales
            </button>
          </div>
        </div>

        <p className="mt-12 text-[11px] text-slate-400">
          All prices in THB. Volume discounts available for enterprise — contact sales.
        </p>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#050F1F] text-slate-400 py-16 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black shadow-sm">A</div>
              <span className="font-bold text-xl tracking-tight text-white">AurumIndex</span>
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
      </footer>
    </div>
  );
};

export default PricingPage;