"use client";

import React from 'react';
import "../app/globals.css"; 

import { 
  ChatBubbleLeftRightIcon, 
  EnvelopeIcon, 
  CheckBadgeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// --- 2. คอมโพเนนต์หน้า Support หลัก ---
const SupportPage = () => {
  const iconStyle = { width: '24px', height: '24px' };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
      
      {/* --- Main Content --- */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex-grow">
        
        {/* --- Header Section --- */}
        <div className="mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent text-[10px] font-bold tracking-wider mb-6">
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
            <button className="flex items-center text-xs font-bold bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent uppercase tracking-widest hover:text-amber-700 transition-colors">
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
            <button className="flex items-center text-xs font-bold bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent uppercase tracking-widest">
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
            <button className="flex items-center text-xs font-bold bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent uppercase tracking-widest">
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
                className="inline-flex items-center justify-center px-6 py-2 -mt-2 text-sm bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-slate-800 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Submit ticket
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;