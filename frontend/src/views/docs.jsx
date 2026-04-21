"use client";

import React from 'react';
import "../app/globals.css";

import { 
  BookOpenIcon, 
  CommandLineIcon, 
  BoltIcon, 
  ArrowPathIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';

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

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-12 text-left">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 border border-amber-200 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent text-[10px] font-bold uppercase tracking-wider mb-6">
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
    </div>
  );
};

export default Docs;