"use client";

import React from 'react';
import Link from 'next/link'; 
import { 
  CheckIcon, 
  CodeBracketIcon, 
  BoltIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline';
import "../app/globals.css";

const PricingPage = () => {
  // สไตล์ animation ที่ใช้ร่วมกัน
  const cardHoverStyle = "transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-2xl";

  return (
    <main className="bg-white flex-grow max-w-full mx-auto px-0 py-16 md:py-24 text-center">
        <section className="pt-8 px-4 bg-white font-sans text-slate-900">
        <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-4 py-1 rounded-full border border-yellow-200 text-yellow-600 text-xs font-medium mb-3 ">
              Pricing
            </div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4 text-[#0B152A]">
              Simple, transparent pricing
            </h2>
            <p className="text-base text-slate-500">
              Start free. Upgrade when you need richer data, lower latency or commercial use.
            </p>
        </div>

        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Free Tier */}
            <div className={`bg-white rounded-2xl border border-slate-200 p-8 flex flex-col shadow-sm ${cardHoverStyle}`}>
            <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold">
                    <CodeBracketIcon className="w-5 h-5 text-gray-800 shrink-0"/>
                </div>
                <div className="text-left">
                <p className="text-xs text-slate-600 uppercase tracking-wider">FREE TIER</p>
                <h3 className="text-lg font-bold text-[#0B152A]">Public Widget</h3>
                </div>
            </div>
            
            <div className="mb-4 flex items-baseline">
                <span className="text-3xl font-bold text-[#0B152A]">฿0</span>
                <span className="text-slate-500 ml-1">forever</span>
            </div>
            
            <p className="text-slate-600 mb-6 text-sm">
                Embed gold prices on any site. Great for blogs and personal use.
            </p>
            
            <ul className="space-y-4 mb-4 flex-1 text-sm text-left">
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Embeddable JS widget</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Spot price preview (with watermark)</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> 15-minute price delay</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Up to 1,000 widget loads / day</li>
            </ul>
            
            <Link href="/dashboard" className="w-full py-2 px-4 bg-[#0B152A] hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors mt-auto text-center">
                Get embed code
            </Link>
            </div>

            {/* Card 2: Plus Tier */}
            <div className={`bg-white rounded-2xl border-2 border-yellow-400 p-8 flex flex-col relative shadow-xl transform md:-translate-y-2 ${cardHoverStyle} hover:-translate-y-5`}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg shadow-sm">
                Most popular
            </div>

            <div className="flex items-center space-x-4 mb-6 mt-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] rounded-xl flex items-center justify-center text-yellow-600">
                    <BoltIcon className="w-5 h-5 font-bold text-gray-800 shrink-0 font-bold"/>
                </div>
                <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider">PLUS TIER</p>
                <h3 className="text-lg font-bold text-[#0B152A]">Developer Starter</h3>
                </div>
            </div>
            
            <div className="mb-4 flex items-baseline">
                <span className="text-3xl font-bold text-[#0B152A]">฿39</span>
                <span className="text-slate-500 ml-1">/month</span>
            </div>
            
            <p className="text-slate-600 mb-6 text-sm">
                Build apps with shop comparison data and reliable price feeds.
            </p>
            
            <ul className="space-y-4 mb-4 flex-1 text-sm text-left">
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Gold Shop Ranking API</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Lowest spread / making charge feed</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> 5-minute refresh interval</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> 10,000 API calls / day</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Email support</li>
            </ul>
            
            <Link href="/checkout" className="w-full py-2 px-4 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:bg-yellow-500 text-black text-sm rounded-lg font-medium transition-colors mt-auto text-center">
                Start with Plus
            </Link>
            </div>

            {/* Card 3: Pro Tier */}
            <div className={`bg-white rounded-2xl border border-slate-200 p-8 flex flex-col shadow-sm ${cardHoverStyle}`}>
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                    <TrophyIcon className="w-5 h-5 text-gray-800 shrink-0 font-bold"/>
                </div>
                <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-wider">PRO TIER</p>
                <h3 className="text-lg font-bold text-[#0B152A]">Analyst Data</h3>
                </div>
            </div>
            
            <div className="mb-4 flex items-baseline">
                <span className="text-3xl font-bold text-[#0B152A]">฿99+</span>
                <span className="text-slate-500 ml-1">/month</span>
            </div>
            
            <p className="text-slate-600 mb-6 text-sm">
                Real-time intelligence for traders, funds and gold institutions.
            </p>
            
            <ul className="space-y-4 mb-4 flex-1 text-sm text-left">
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Real-time WebSocket API</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Webhook events & alerts</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Market Sentiment Score</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Predictive trend models</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> 100,000+ API calls / day</li>
                <li className="flex text-slate-800"><CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0"/> Priority SLA support</li>
            </ul>
            
            <Link href="/checkout" className="w-full py-2 px-4 bg-[#0B152A] hover:bg-slate-800 text-white text-sm rounded-lg font-medium transition-colors mt-auto text-center">
                Talk to sales
            </Link>
            </div>

        </div>
        </section>

        <p className="mt-8 text-[11px] text-slate-400">
        All prices in THB. Volume discounts available for enterprise — contact sales.
        </p>
    </main>
  );
};

export default PricingPage;