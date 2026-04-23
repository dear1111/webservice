"use client";

import React, { useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Squares2X2Icon, KeyIcon, ChartBarIcon, PlusIcon, DocumentDuplicateIcon, ArrowTrendingUpIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';
import "../app/globals.css";

const chartData = [
  { time: '00:00', actual: 2365.12, projected: 2372.40 }, { time: '04:00', actual: 2396.30, projected: 2402.50 },
  { time: '08:00', actual: 2384.20, projected: 2390.10 }, { time: '12:00', actual: 2358.90, projected: 2362.10 },
  { time: '16:00', actual: 2373.10, projected: 2377.20 }, { time: '20:00', actual: 2412.80, projected: 2418.90 },
  { time: '23:00', actual: 2428.90, projected: 2438.50 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production Key', key: 'ai_live_8f92a4b1c3d5...', created: 'Oct 12, 2025', usage: 850 },
    { id: 2, name: 'Testing Key', key: 'ai_test_2a9b4c1d8f7e...', created: 'Nov 01, 2025', usage: 120 }
  ]);

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    alert("API Key copied!");
  };

  const generateNewKey = () => {
    const newKey = { id: Date.now(), name: `Service Key ${apiKeys.length + 1}`, key: `ai_live_${Math.random().toString(16).substring(2, 14)}`, created: 'Just now', usage: 0 };
    setApiKeys([...apiKeys, newKey]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <div className="flex-grow max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-8 p-6">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <div className="bg-[#0A1D3A] rounded-3xl p-6 text-white shadow-2xl sticky top-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Microservices</h2>
            <nav className="space-y-2">
              {['Overview', 'API Keys', 'Usage Metrics'].map((item) => (
                <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item ? 'bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  {item === 'Overview' && <Squares2X2Icon className="w-5 h-5" />}
                  {item === 'API Keys' && <KeyIcon className="w-5 h-5" />}
                  {item === 'Usage Metrics' && <ChartBarIcon className="w-5 h-5" />}
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-8">
          {activeTab === 'Overview' && (
            <>
              <header>
                <h1 className="text-3xl font-bold text-[#0B152A]">Overview</h1>
                <p className="text-slate-500">Welcome back, check your service health below.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[ { label: 'Calls Today', value: '450', icon: ChartBarIcon }, { label: 'Latency', value: '187ms', icon: ArrowTrendingUpIcon }, { label: 'Active Keys', value: apiKeys.length, icon: KeyIcon }, { label: 'Uptime', value: '99.9%', icon: ShieldCheckIcon } ].map((s) => (
                  <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <s.icon className="w-6 h-6 text-yellow-500 mb-4" />
                    <p className="text-[10px] text-slate-400 uppercase">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" fill="#EAB308" stroke="#EAB308" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'API Keys' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">API Keys</h1>
                <button onClick={generateNewKey} className="bg-[#0B152A] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all">
                  <PlusIcon className="w-5 h-5" /> Generate New Key
                </button>
              </div>
              <table className="w-full">
                <thead className="text-slate-400 text-xs uppercase text-left">
                  <tr><th className="p-4">Name</th><th className="p-4">Secret Key</th><th className="p-4">Usage</th><th className="p-4 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiKeys.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4 font-bold">{item.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">{item.key}</td>
                      <td className="p-4">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${(item.usage / 1000) * 100}%` }}></div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => copyToClipboard(item.key)} className="text-amber-600 font-bold text-xs flex items-center justify-end gap-1">
                          <DocumentDuplicateIcon className="w-4 h-4" /> Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;