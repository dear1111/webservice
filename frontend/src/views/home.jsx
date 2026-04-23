"use client";

import React from "react";
import {
  CheckIcon,
  ArrowRightIcon,
  BoltIcon,
  CodeBracketIcon,
  TrophyIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const chartData = [
  { time: "00:00", actual: 2365.12, projected: 2372.4 },
  { time: "01:00", actual: 2372.45, projected: 2380.15 },
  { time: "02:00", actual: 2381.2, projected: 2388.9 },
  { time: "03:00", actual: 2390.5, projected: 2396.1 },
  { time: "04:00", actual: 2396.3, projected: 2402.5 },
  { time: "05:00", actual: 2400.1, projected: 2406.8 },
  { time: "06:00", actual: 2398.5, projected: 2405.2 },
  { time: "07:00", actual: 2392.4, projected: 2398.9 },
  { time: "08:00", actual: 2384.2, projected: 2390.1 },
  { time: "09:00", actual: 2375.6, projected: 2381.4 },
  { time: "10:00", actual: 2368.1, projected: 2373.2 },
  { time: "11:00", actual: 2362.4, projected: 2367.5 },
  { time: "12:00", actual: 2358.9, projected: 2362.1 },
  { time: "13:00", actual: 2357.2, projected: 2359.8 },
  { time: "14:00", actual: 2360.5, projected: 2362.4 },
  { time: "15:00", actual: 2365.8, projected: 2368.9 },
  { time: "16:00", actual: 2373.1, projected: 2377.2 },
  { time: "17:00", actual: 2382.4, projected: 2387.5 },
  { time: "18:00", actual: 2392.6, projected: 2398.1 },
  { time: "19:00", actual: 2403.5, projected: 2408.4 },
  { time: "20:00", actual: 2412.8, projected: 2418.9 },
  { time: "21:00", actual: 2420.4, projected: 2427.2 },
  { time: "22:00", actual: 2425.6, projected: 2434.1 },
  { time: "23:00", actual: 2428.9, projected: 2438.5 },
];

// สร้าง Custom Tooltip ตามดีไซน์ในภาพ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const actualData = payload.find((p) => p.dataKey === "actual");
    const projectedData = payload.find((p) => p.dataKey === "projected");

    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 text-sm min-w-[140px]">
        {/* เวลา */}
        <p className="font-bold text-[#0B152A] mb-2">{label}</p>

        {/* Forecast */}
        {projectedData && (
          <p className="text-slate-500 mb-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
            forecast : {projectedData.value.toFixed(2)}
          </p>
        )}

        {/* Price */}
        {actualData && (
          <p className="text-yellow-600 font-medium flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span>
            price : {actualData.value.toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

// --- Component หลักของหน้า Home ---
const Home = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (จากภาพแรก) */}
      <section className="bg-linear-to-br from-[#050F1F] to-[#0A1D3A] text-white pt-26 pb-16 px-4">
        <div className="absolute inset-0 opacity-5 bg-[url('/images/pexels-rudonni-7114280.jpg')] bg-cover bg-center z-0"></div>
        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 relative">
          <div className="space-y-5 py-4">
            <p
              className="inline-flex items-center gap-2 px-4 py-0.5 rounded-lg
                    bg-[rgba(230,184,76,0.1)]
                    border border-[rgba(230,184,76,0.6)]
                    text-[#F2C94C] text-xs"
            >
              Live · LBMA-aligned
            </p>
            <h1 className="text-6xl font-bold leading-tight\">
              The Gold Market
              <br />
              <span className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent">
                Index & API
              </span>
              <span> Provider</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-lg">
              Reference-grade gold pricing, shop rankings, and predictive
              sentiment — delivered through a developer-first API. Trusted by
              analysts, fintech and bullion shops.
            </p>
            <div className="flex space-x-4">
              <Link href="/pricing"
                className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:bg-yellow-500 shadow-md shadow-[#D99A1F]/50 text-gray-800 px-7 py-2.5 rounded-md font-semibold text-[13px] inline-block text-center"
              >
                Start free →
              </Link>
              <Link href="/docs"
                className="hover:bg-slate-800 border border-slate-400 text-white px-7 py-2.5 rounded-md font-semibold text-[13px] inline-block text-center"
              >
                View API docs
              </Link>
            </div>
            <div className="max-w-full mx-auto border-t border-gray-700 py-10 mt-10">
              <div className="flex space-between">
                <div className="flex-1">
                  <p className="text-2xl bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent font-bold">
                    &lt; 1s
                  </p>
                  <p className="text-[12px] text-gray-400">UPDATE FREQ</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent font-bold">
                    120+
                  </p>
                  <p className="text-[12px] text-gray-400">SHOPS INDEXED</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] bg-clip-text text-transparent font-bold">
                    99.99%
                  </p>
                  <p className="text-[12px] text-gray-400">API UPTIME</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8fafc] rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-3xl mx-auto font-sans relative z-10 border border-slate-100">
            {/* Header ของกราฟ */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  XAU / THB
                </p>
                <h3 className="text-4xl font-bold text-[#0B152A]">฿2,398.40</h3>
              </div>
              <div className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">
                +0.82%
              </div>
            </div>

            {/* พื้นที่วาดกราฟ */}
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  {/* สี Gradient ใต้กราฟ */}
                  <defs>
                    <linearGradient
                      id="colorActual"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* แกน X (เวลา) กำหนดให้โชว์แค่บางช่วง (ticks) เพื่อไม่ให้รกเกินไป แม้จะมีข้อมูล 24 ตัว */}
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                    dy={10}
                    ticks={[
                      "00:00",
                      "04:00",
                      "08:00",
                      "12:00",
                      "16:00",
                      "20:00",
                    ]}
                  />

                  {/* แกน Y (ราคา) */}
                  <YAxis
                    domain={["dataMin - 10", "dataMax + 10"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#94A3B8" }}
                    tickCount={5}
                  />

                  {/* ใส่ Tooltip ที่เราสร้าง Custom ไว้ด้านบน */}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "#cbd5e1",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />

                  {/* เส้นประสีเทาด้านบน (Projected Data) */}
                  <Line
                    type="monotone"
                    dataKey="projected"
                    stroke="#64748B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#64748B",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />

                  {/* พื้นที่สีเหลืองและเส้นทึบ (Actual Data) */}
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#EAB308"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    activeDot={{
                      r: 5,
                      fill: "#EAB308",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-white font-sans text-slate-900">
        <div className="max-w-full text-center">
          <ul className="flex space-between font-semibold text-slate-500 space-x-10">
            <li className="flex-1 text-sm">LBMA-ALIGNED</li>
            <li className="flex-1 text-sm">SOC 2 READY</li>
            <li className="flex-1 text-sm">WEBSOCKET & REST</li>
            <li className="flex-1 text-sm">WEBHOOKS</li>
            <li className="flex-1 text-sm">15 YRS OF HISTORY</li>
          </ul>
        </div>
      </section>

      {/* 2. Pricing Section (จากภาพแรก) */}
      <section className="py-24 px-4 bg-white font-sans text-slate-900">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full border border-yellow-200 text-yellow-600 text-xs font-medium mb-3 ">
            Service packages
          </div>
          <h2 className="text-lg md:text-4xl font-bold mb-4 text-[#0B152A]">
            Pricing built for every gold workflow
          </h2>
          <p className="text-base text-slate-500">
            From a free embeddable widget to institutional real-time feeds —
            pick what fits.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Free Tier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold">
                <CodeBracketIcon className="w-5 h-5 text-gray-800 shrink-0 font-bold" />
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-wider">
                  FREE TIER
                </p>
                <h3 className="text-lg font-bold text-[#0B152A]">
                  Public Widget
                </h3>
              </div>
            </div>

            <div className="mb-4 flex items-baseline">
              <span className="text-3xl font-bold text-[#0B152A]">฿0</span>
              <span className="text-slate-500 ml-1">forever</span>
            </div>

            <p className="text-slate-600 mb-6 text-sm">
              Embed gold prices on any site. Great for blogs and personal use.
            </p>

            <ul className="space-y-4 mb-4 flex-1 text-sm">
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Embeddable JS widget
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Spot price preview (with watermark)
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                15-minute price delay
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Up to 1,000 widget loads / day
              </li>
            </ul>

            <button className="w-full py-2 px-4 bg-[#0B152A] hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors mt-auto">
              Get embed code
            </button>
          </div>

          {/* Card 2: Plus Tier (Highlighted) */}
          <div className="bg-white rounded-2xl border-1 border-yellow-400 p-8 flex flex-col relative shadow-xl transform md:-translate-y-2">
            {/* Most Popular Badge */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg shadow-sm">
              Most popular
            </div>

            <div className="flex items-center space-x-4 mb-6 mt-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] rounded-xl flex items-center justify-center text-yellow-600">
                <BoltIcon className="w-5 h-5 font-bold text-gray-800 shrink-0 font-bold" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  PLUS TIER
                </p>
                <h3 className="text-lg font-bold text-[#0B152A]">
                  Developer Starter
                </h3>
              </div>
            </div>

            <div className="mb-4 flex items-baseline">
              <span className="text-3xl font-bold text-[#0B152A]">฿39</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>

            <p className="text-slate-600 mb-6 text-sm">
              Build apps with shop comparison data and reliable price feeds.
            </p>

            <ul className="space-y-4 mb-4 flex-1 text-sm">
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Gold Shop Ranking API
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Lowest spread / making charge feed
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                5-minute refresh interval
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                10,000 API calls / day
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Email support
              </li>
            </ul>

            <button className="w-full py-2 px-4 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:bg-yellow-500 text-black text-sm rounded-lg font-medium transition-colors mt-auto">
              Start with Plus
            </button>
          </div>

          {/* Card 3: Pro Tier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <TrophyIcon className="w-5 h-5 text-gray-800 shrink-0 font-bold" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  PRO TIER
                </p>
                <h3 className="text-lg font-bold text-[#0B152A]">
                  Analyst Data
                </h3>
              </div>
            </div>

            <div className="mb-4 flex items-baseline">
              <span className="text-3xl font-bold text-[#0B152A]">฿99+</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>

            <p className="text-slate-600 mb-6 text-sm">
              Real-time intelligence for traders, funds and gold institutions.
            </p>

            <ul className="space-y-4 mb-4 flex-1 text-sm">
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Real-time WebSocket API
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Webhook events & alerts
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Market Sentiment Score
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Predictive trend models
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                100,000+ API calls / day
              </li>
              <li className="flex text-slate-800">
                <CheckIcon className="w-5 h-5 text-yellow-500 mr-3 shrink-0" />{" "}
                Priority SLA support
              </li>
            </ul>

            <button className="w-full py-2 px-4 bg-[#0B152A] hover:bg-slate-800 text-white text-sm rounded-lg font-medium transition-colors mt-auto">
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white font-sans text-slate-900">
        <div className="max-w-full mx-auto space-y-32">
          {/* Row 1: Ticker Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Area */}
            <div>
              <div className="inline-block px-3 py-1 rounded-full border border-yellow-200 text-yellow-600 text-xs font-medium mb-6">
                Free Tier • Public Widget
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B152A] mb-4 leading-tight">
                Drop a gold price ticker on any page
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                One copy-paste line. Watermarked widget with a 15-minute delay —
                perfect for blogs, marketing sites and shop pages.
              </p>
            </div>

            {/* Code & Preview Area */}
            <div className="shadow-2xl rounded-xl">
              {/* Code Editor Header */}
              <div className="bg-[#0A1D3A] rounded-t-xl p-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-slate-400 text-xs font-mono">
                  embed.html
                </div>
                <button className="text-slate-300 flex items-center text-xs hover:text-white transition-colors">
                  <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
              {/* Code Content */}
              <div className="bg-[#0A1D3A] p-6 text-sm font-mono overflow-x-auto text-slate-300">
                <pre>
                  <code className="text-blue-300">{`<script `}</code>
                  <span className="text-slate-300">
                    src=&quot;https://cdn.aurumindex.io/widget.js&quot;
                  </span>
                  <br />
                  <span className="text-slate-300 pl-8">
                    data-key=&quot;public&quot; data-symbol=&quot;XAUTHB&quot;
                  </span>
                  <br />
                  <span className="text-slate-300 pl-8">
                    data-theme=&quot;light&quot;
                  </span>
                  <code className="text-blue-300">{`></script>`}</code>
                </pre>
              </div>
              {/* Widget Preview */}
              <div className="bg-white rounded-b-xl p-6 border-x border-b border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Gold Spot · 15M Delayed
                  </p>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">24h change</p>
                    <p className="text-xs font-bold text-green-600">+0.74%</p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-3xl font-bold text-[#0B152A]">฿2,397.10</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Powered by Aurumindex
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Ranking Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Table Area (Order Last on mobile, First on Desktop) */}
            <div className="order-2 lg:order-1 overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100 p-2">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="text-slate-500 text-xs border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-4 font-medium">#</th>
                    <th className="py-4 px-4 font-medium">Gold Shop</th>
                    <th className="py-4 px-4 font-medium text-right">
                      Spread (THB)
                    </th>
                    <th className="py-4 px-4 font-medium text-right">
                      Making (THB)
                    </th>
                    <th className="py-4 px-4 font-medium text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="flex items-center justify-center w-6 h-6 border border-yellow-400 text-yellow-600 rounded-full text-xs font-bold">
                        1
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#0B152A]">
                      Hua Seng Heng
                    </td>
                    <td className="py-4 px-4 text-right">8</td>
                    <td className="py-4 px-4 text-right">250</td>
                    <td className="py-4 px-4 text-center pl-8">
                      <ArrowTrendingDownIcon className="w-5 h-5 text-green-500 shrink-0" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-400 pl-6">2</td>
                    <td className="py-4 px-4 font-medium text-[#0B152A]">
                      YLG Bullion
                    </td>
                    <td className="py-4 px-4 text-right">10</td>
                    <td className="py-4 px-4 text-right">280</td>
                    <td className="py-4 px-4 text-center pl-8">
                      <ArrowTrendingDownIcon className="w-5 h-5 text-green-500 shrink-0" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-400 pl-6">3</td>
                    <td className="py-4 px-4 font-medium text-[#0B152A]">
                      MTS Gold
                    </td>
                    <td className="py-4 px-4 text-right">12</td>
                    <td className="py-4 px-4 text-right">300</td>
                    <td className="py-4 px-4 text-center pl-8">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-red-500 shrink-0" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-400 pl-6">4</td>
                    <td className="py-4 px-4 font-medium text-[#0B152A]">
                      Ausiris
                    </td>
                    <td className="py-4 px-4 text-right">14</td>
                    <td className="py-4 px-4 text-right">320</td>
                    <td className="py-4 px-4 text-center pl-8">
                      <ArrowTrendingDownIcon className="w-5 h-5 text-green-500 shrink-0" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-400 pl-6">5</td>
                    <td className="py-4 px-4 font-medium text-[#0B152A]">
                      Classic Gold
                    </td>
                    <td className="py-4 px-4 text-right">16</td>
                    <td className="py-4 px-4 text-right">350</td>
                    <td className="py-4 px-4 text-center pl-8">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-red-500 shrink-0" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Text Area (Order First on mobile, Last on Desktop) */}
            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 rounded-full border border-yellow-200 text-yellow-600 text-xs font-medium mb-6">
                Plus Tier • Developer Starter
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B152A] mb-4 leading-tight">
                Gold Shop Ranking, ranked by best spread
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Programmatic access to 120+ Thai bullion shops — ranked by the
                lowest spread and making charges, refreshed every 5 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* --- ROW 3: Pro Tier (เพิ่มใหม่ตามภาพล่าสุด) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-8 border-t border-slate-50">
          {/* Text Area (ซ้าย) */}
          <div>
            <div className="inline-block px-3 py-1 rounded-full border border-yellow-200 text-yellow-600 text-xs font-medium mb-6">
              Pro Tier • Analyst Data
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B152A] mb-4 leading-tight">
              Real-time API, Webhooks & Sentiment Score
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Institutional feeds with WebSocket streaming, event webhooks, and
              a proprietary Market Sentiment Score blending news, futures and
              order-flow.
            </p>
          </div>

          {/* Widgets Area (ขวา) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Box 1: Sentiment Gauge */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[250px]">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full text-left mb-4">
                Market Sentiment
              </h4>

              {/* Custom SVG Gauge (72/100) */}
              <div className="relative w-full max-w-[180px] mx-auto mt-2">
                <svg viewBox="0 0 100 60" className="w-full overflow-visible">
                  <defs>
                    <linearGradient
                      id="gaugeGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
                      <stop offset="30%" stopColor="#f97316" /> {/* Orange */}
                      <stop offset="60%" stopColor="#eab308" /> {/* Yellow */}
                      <stop offset="100%" stopColor="#22c55e" /> {/* Green */}
                    </linearGradient>
                  </defs>
                  {/* พื้นหลัง Gauge */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* เส้นสีรุ้ง */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* เข็มชี้ (หมุน 40 องศาไปทางขวา = 72% โดยประมาณ) */}
                  <g
                    style={{
                      transformOrigin: "50px 50px",
                      transform: "rotate(40deg)",
                    }}
                  >
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="18"
                      stroke="#0B152A"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="3" fill="#0B152A" />
                    <circle cx="50" cy="50" r="1.5" fill="#facc15" />
                  </g>
                </svg>

                {/* Text 72/100 */}
                <div className="flex-1 justify-center text-center pt-2">
                  <p className="text-3xl font-bold text-[#0B152A]">
                    72
                    <span className="text-sm text-slate-400 font-medium">
                      /100
                    </span>
                  </p>
                  <p className="text-xs font-bold text-green-500 mt-1 uppercase tracking-widest">
                    Bullish
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2-4: Stacked Feature Cards */}
            <div className="flex flex-col space-y-4">
              {/* Feature: WebSocket */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 flex flex-col justify-center">
                <BoltIcon className="w-5 h-5 text-yellow-500 shrink-0" />
                <h4 className="font-bold text-[#0B152A] text-sm mb-1">
                  Real-time WebSocket
                </h4>
                <p className="text-xs text-slate-500">
                  &lt; 200 ms tick latency
                </p>
              </div>

              {/* Feature: Webhooks */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 flex flex-col justify-center">
                <ArrowPathIcon className="w-5 h-5 text-yellow-500 shrink-0" />
                <h4 className="font-bold text-[#0B152A] text-sm mb-1">
                  Webhooks
                </h4>
                <p className="text-xs text-slate-500">
                  Price • spread • volatility events
                </p>
              </div>

              {/* Feature: SLA */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 flex flex-col justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-yellow-500 shrink-0" />
                <h4 className="font-bold text-[#0B152A] text-sm mb-1">
                  99.99% SLA
                </h4>
                <p className="text-xs text-slate-500">
                  Priority support included
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section ก่อนเข้า Footer */}
      <section className="bg-linear-to-br from-[#07162D] to-[#0D2445] py-24 flex justify-center items-center text-white">
        <div className="max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-2">
                Build the next generation of gold-market apps
            </h2>
            <p className="text-sm mb-6 text-gray-400">
                Sign up in 60 seconds. Free tier, no credit card required.
            </p>
            <Link 
                href="/pricing"
                className="inline-flex items-center justify-center bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] shadow-lg shadow-[#D99A1F]/25 text-slate-800 px-8 py-3 rounded-md font-semibold text-sm hover:bg-yellow-500 transition-colors"
            >
                Open developer dashboard <ArrowRightIcon className="ml-2 w-5 h-5"/>
            </Link>
          
        </div>
      </section>
    </div>
  );
};

export default Home;
