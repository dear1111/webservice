"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Squares2X2Icon, 
  KeyIcon, 
  ChartBarIcon, 
  GlobeAltIcon, 
  FaceSmileIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import "../app/globals.css";

// ข้อมูลจำลองสำหรับกราฟ
const chartData = [
  { time: '00:00', price: 2380, prediction: 2390 },
  { time: '04:00', price: 2405, prediction: 2410 },
  { time: '08:00', price: 2395, prediction: 2390 },
  { time: '12:00', price: 2370, prediction: 2375 },
  { time: '16:00', price: 2385, prediction: 2380 },
  { time: '20:00', price: 2410, prediction: 2415 },
];

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

// --- Dashboard Component ---
const Dashboard = () => {
  const iconStyle = { width: '18px', height: '18px' };

  return (
    // แก้ไขที่นี่: ใช้ flex-col และ min-h-screen เพื่อจัดการ layout แนวตั้ง
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Navbar />

      {/* แก้ไขที่นี่: เพิ่ม flex-grow เพื่อดัน Footer ลงไปข้างล่าง */}
      <div className="flex-grow max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-8 p-6 md:p-10">
        
        {/* --- Sidebar (Left) --- */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="bg-[#0B152A] rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Microservices</p>
            <nav className="space-y-1">
              {[
                { name: 'Overview', icon: <Squares2X2Icon style={iconStyle} />, active: true },
                { name: 'API Keys', icon: <KeyIcon style={iconStyle} /> },
                { name: 'Usage Metrics', icon: <ChartBarIcon style={iconStyle} /> },
                { name: 'Webhooks', icon: <GlobeAltIcon style={iconStyle} /> },
                { name: 'Sentiment', icon: <FaceSmileIcon style={iconStyle} /> },
                { name: 'Settings', icon: <Cog6ToothIcon style={iconStyle} /> },
              ].map((item) => (
                <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
            <div className="mt-8 px-4 py-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs font-bold text-amber-500 mb-1">Pro plan</p>
              <p className="text-[10px] text-slate-500 uppercase">100,000 calls/day</p>
            </div>
          </div>
        </aside>

        {/* --- Main Dashboard (Right) --- */}
        <main className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B152A]">Overview</h1>
            <p className="text-sm text-slate-500">Live snapshot of your AurumIndex services.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Calls Today', value: '24,801', change: '+12%', color: 'text-green-500' },
              { label: 'Avg Latency', value: '187ms', change: '-8%', color: 'text-green-500' },
              { label: 'Active Keys', value: '3', change: '', color: '' },
              { label: 'Errors', value: '0.02%', change: '-0.01%', color: 'text-green-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[#0B152A]">{stat.value}</p>
                  <span className={`text-[10px] font-bold ${stat.color}`}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">XAU / THB · 24h</p>
                <h2 className="text-sm font-medium text-slate-600">Spot price · gold prediction overlay</h2>
              </div>
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-md border border-green-100">Live</span>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="price" stroke="#EAB308" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  <Area type="monotone" dataKey="prediction" stroke="#0B152A" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>

      {/* Footer จะอยู่ติดล่างสุดเสมอ */}
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
      </footer>
    </div>
  );
};

export default Dashboard;