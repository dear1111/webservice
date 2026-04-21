"use client";

import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
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
  { time: '00:00', actual: 2365.12, projected: 2372.40 },
  { time: '01:00', actual: 2372.45, projected: 2380.15 },
  { time: '02:00', actual: 2381.20, projected: 2388.90 },
  { time: '03:00', actual: 2390.50, projected: 2396.10 },
  { time: '04:00', actual: 2396.30, projected: 2402.50 },
  { time: '05:00', actual: 2400.10, projected: 2406.80 },
  { time: '06:00', actual: 2398.50, projected: 2405.20 },
  { time: '07:00', actual: 2392.40, projected: 2398.90 },
  { time: '08:00', actual: 2384.20, projected: 2390.10 },
  { time: '09:00', actual: 2375.60, projected: 2381.40 },
  { time: '10:00', actual: 2368.10, projected: 2373.20 },
  { time: '11:00', actual: 2362.40, projected: 2367.50 },
  { time: '12:00', actual: 2358.90, projected: 2362.10 },
  { time: '13:00', actual: 2357.20, projected: 2359.80 },
  { time: '14:00', actual: 2360.50, projected: 2362.40 },
  { time: '15:00', actual: 2365.80, projected: 2368.90 },
  { time: '16:00', actual: 2373.10, projected: 2377.20 },
  { time: '17:00', actual: 2382.40, projected: 2387.50 },
  { time: '18:00', actual: 2392.60, projected: 2398.10 },
  { time: '19:00', actual: 2403.50, projected: 2408.40 },
  { time: '20:00', actual: 2412.80, projected: 2418.90 },
  { time: '21:00', actual: 2420.40, projected: 2427.20 },
  { time: '22:00', actual: 2425.60, projected: 2434.10 },
  { time: '23:00', actual: 2428.90, projected: 2438.50 },
];

// สร้าง Custom Tooltip ตามดีไซน์ในภาพ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const actualData = payload.find(p => p.dataKey === 'actual');
    const projectedData = payload.find(p => p.dataKey === 'projected');

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

// --- Dashboard Component ---
const Dashboard = () => {
  const iconStyle = { width: '18px', height: '18px' };

  return (
    // แก้ไขที่นี่: ใช้ flex-col และ min-h-screen เพื่อจัดการ layout แนวตั้ง
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* แก้ไขที่นี่: เพิ่ม flex-grow เพื่อดัน Footer ลงไปข้างล่าง */}
      <div className="flex-grow max-w-full w-full mx-auto flex flex-col lg:flex-row gap-8 p-2 md:p-4">
        
        {/* --- Sidebar (Left) --- */}
        <aside className="w-full lg:w-64 space-y-6 pt-4">
          <div className="bg-[#0A1D3A] rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 pt-1">Microservices</p>
            <nav className="space-y-1">
              {[
                { name: 'Overview', icon: <Squares2X2Icon style={iconStyle} />, active: true },
                { name: 'API Keys', icon: <KeyIcon style={iconStyle} /> },
                { name: 'Usage Metrics', icon: <ChartBarIcon style={iconStyle} /> },
                { name: 'Webhooks', icon: <GlobeAltIcon style={iconStyle} /> },
                { name: 'Sentiment', icon: <FaceSmileIcon style={iconStyle} /> },
                { name: 'Settings', icon: <Cog6ToothIcon style={iconStyle} /> },
              ].map((item) => (
                <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] shadow-lg shadow-[#D99A1F]/25 text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
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
        <main className="flex-1 space-y-8 pt-4">
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

            {/* พื้นที่วาดกราฟ */}
                        <div className="h-[250px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                {/* สี Gradient ใต้กราฟ */}
                                <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                                </linearGradient>
                                </defs>
            
                                {/* แกน X (เวลา) กำหนดให้โชว์แค่บางช่วง (ticks) เพื่อไม่ให้รกเกินไป แม้จะมีข้อมูล 24 ตัว */}
                                <XAxis 
                                dataKey="time" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: '#94A3B8' }} 
                                dy={10}
                                ticks={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']}
                                />
            
                                {/* แกน Y (ราคา) */}
                                <YAxis 
                                domain={['dataMin - 10', 'dataMax + 10']} 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: '#94A3B8' }}
                                tickCount={5}
                                />
            
                                {/* ใส่ Tooltip ที่เราสร้าง Custom ไว้ด้านบน */}
                                <Tooltip 
                                content={<CustomTooltip />} 
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
                                />
            
                                {/* เส้นประสีเทาด้านบน (Projected Data) */}
                                <Line 
                                type="monotone" 
                                dataKey="projected" 
                                stroke="#64748B" 
                                strokeWidth={2}
                                strokeDasharray="4 4" 
                                dot={false}
                                activeDot={{ r: 4, fill: "#64748B", stroke: "#fff", strokeWidth: 2 }} 
                                />
            
                                {/* พื้นที่สีเหลืองและเส้นทึบ (Actual Data) */}
                                <Area 
                                type="monotone" 
                                dataKey="actual" 
                                stroke="#EAB308" 
                                strokeWidth={2.5}
                                fillOpacity={1} 
                                fill="url(#colorActual)" 
                                activeDot={{ r: 5, fill: "#EAB308", stroke: "#fff", strokeWidth: 2 }}
                                />
                            </ComposedChart>
                            </ResponsiveContainer>
                        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;