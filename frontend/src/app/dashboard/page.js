"use client";

import { useEffect, useState } from "react";
// 💡 เราจะจำลองตาราง API Key ตรงนี้เลย หรือถ้านายจะ import ควรสร้างไฟล์แยกที่ไม่มี Navbar ครับ
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Squares2X2Icon,
  KeyIcon,
  ChartBarIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// ข้อมูลจำลองสำหรับกราฟ
const liveChartData = [
  { time: "00:00", actual: 2365.12, projected: 2372.4 },
  { time: "04:00", actual: 2396.3, projected: 2402.5 },
  { time: "08:00", actual: 2384.2, projected: 2390.1 },
  { time: "12:00", actual: 2358.9, projected: 2362.1 },
  { time: "16:00", actual: 2373.1, projected: 2377.2 },
  { time: "20:00", actual: 2412.8, projected: 2418.9 },
  { time: "23:00", actual: 2428.9, projected: 2438.5 },
];

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview"); 
  const [apiKeys, setApiKeys] = useState([]); 

  useEffect(() => {
    const checkUser = setTimeout(() => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setApiKeys([{ id: 1, key: "sk_live_12345xxxx", name: "Production Key" }]);
      } else {
        window.location.href = "/login";
      }
    }, 0);
    return () => clearTimeout(checkUser);
  }, []);

  const getPlanDetails = (planId) => {
    switch (planId) {
      case 2: return { name: "Plus Tier ⚡", badge: "bg-amber-50 text-amber-700 border border-amber-200" };
      case 3: return { name: "Pro Tier 🏆", badge: "bg-purple-50 text-purple-700 border border-purple-200" };
      default: return { name: "Free Tier 💡", badge: "bg-slate-100 text-slate-600 border border-slate-200" };
    }
  };

  const handleCancelPlan = () => {
    if (window.confirm("แน่ใจหรือไม่ที่จะยกเลิกแพ็กเกจ?")) {
      const userObj = { ...user, plan_id: 1 };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      window.dispatchEvent(new Event('userUpdated'));
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400 animate-pulse">
      Loading System...
    </div>
  );

  const userPlan = getPlanDetails(user.plan_id);
  
  // คำนวณ Usage
  const totalUsage = 950; 
  const maxLimit = user.plan_id === 3 ? 100000 : user.plan_id === 2 ? 10000 : 1000;
  const percentUsed = Math.min((totalUsage / maxLimit) * 100, 100);
  const isDanger = percentUsed >= 90; 

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <div className="flex-grow max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-8 p-6">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <div className="bg-[#0A1D3A] rounded-3xl p-6 text-white shadow-2xl sticky top-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Microservices</h2>
            <nav className="space-y-2">
              {["Overview", "API Keys", "Usage Metrics"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item 
                      ? "bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black shadow-lg" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item === "Overview" && <Squares2X2Icon className="w-5 h-5" />}
                  {item === "API Keys" && <KeyIcon className="w-5 h-5" />}
                  {item === "Usage Metrics" && <ChartBarIcon className="w-5 h-5" />}
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          
          {/* 🌟 Tab: Overview */}
          {activeTab === "Overview" && (
            <div className="animate-fade-up">
              <header className="flex flex-col gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#0B152A]">Overview</h1>
                  <p className="text-slate-500">Welcome back, {user.email}</p>
                </div>

                {isDanger && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <ChartBarIcon className="w-5 h-5 text-red-600 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-red-700">Warning: High API Usage</h4>
                        <p className="text-xs text-red-600/80">คุณใช้งานไปแล้ว {percentUsed.toFixed(1)}% ของแพ็กเกจปัจจุบัน ({totalUsage.toLocaleString()} / {maxLimit.toLocaleString()})</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all shadow-md">
                      Upgrade Plan
                    </button>
                  </div>
                )}

                <div className={`flex items-center justify-between px-5 py-3 rounded-2xl shadow-sm ${userPlan.badge}`}>
                  <span className="text-sm font-bold">Current Plan: {userPlan.name}</span>
                  {user.plan_id > 1 && (
                    <button onClick={handleCancelPlan} className="text-xs font-bold text-red-500 bg-white px-4 py-2 rounded-xl border border-red-200 transition-all">
                      Cancel Plan
                    </button>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`p-6 rounded-3xl border shadow-sm transition-all ${isDanger ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
                  <ChartBarIcon className={`w-6 h-6 mb-4 ${isDanger ? 'text-red-500 animate-bounce' : 'text-yellow-500'}`} />
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDanger ? 'text-red-500' : 'text-slate-400'}`}>Calls Today</p>
                  <p className={`text-2xl font-bold mt-1 ${isDanger ? 'text-red-700' : 'text-black'}`}>{totalUsage.toLocaleString()} <span className="text-sm font-medium opacity-50">/ {maxLimit.toLocaleString()}</span></p>
                </div>
                {[
                  { label: "Latency", value: "187ms", icon: ArrowTrendingUpIcon },
                  { label: "Active Keys", value: apiKeys.length, icon: KeyIcon },
                  { label: "Uptime", value: "99.9%", icon: ShieldCheckIcon },
                ].map((s) => (
                  <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <s.icon className="w-6 h-6 text-yellow-500 mb-4" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-bold text-black mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 h-[400px] shadow-sm mb-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#0B152A]">Live Gold Price</h3>
                </div>
                <ResponsiveContainer width="100%" height="83%">
                  <ComposedChart data={liveChartData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F6C65B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F6C65B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={["dataMin - 50", "dataMax + 50"]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `฿${v.toLocaleString()}`}/>
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                    <Area type="monotone" dataKey="actual" fill="url(#colorActual)" stroke="#D99A1F" strokeWidth={3} />
                    <Line type="monotone" dataKey="projected" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 🌟 Tab: API Keys */}
          {activeTab === "API Keys" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-fade-up">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-black">Your Secret Keys</h2>
                <button className="bg-yellow-500 text-black px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all">
                  <PlusIcon className="w-5 h-5" /> Generate New Key
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="text-slate-400 text-xs uppercase border-b border-slate-100">
                  <tr><th className="pb-4">Name</th><th className="pb-4">Secret Key</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiKeys.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 font-bold text-black">{item.name}</td>
                      <td className="py-4 font-mono text-xs text-slate-500">{item.key}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🌟 Tab: Usage Metrics */}
          {activeTab === "Usage Metrics" && (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center animate-fade-up">
              <ChartBarIcon className={`w-16 h-16 mx-auto mb-4 ${isDanger ? 'text-red-500 animate-bounce' : 'text-slate-200'}`} />
              <h2 className="text-2xl font-bold mb-2">Usage Statistics</h2>
              <p className="text-slate-500 mb-8">
                You have used <b>{totalUsage.toLocaleString()}</b> requests out of your {maxLimit.toLocaleString()} limit.
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isDanger ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'}`} 
                    style={{ width: `${percentUsed}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                  <span>0%</span>
                  <span className={isDanger ? 'text-red-500' : ''}>{percentUsed.toFixed(1)}% used</span>
                  <span>100%</span>
                </div>

                {isDanger && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold animate-pulse">
                    ⚠️ Quota ของคุณใกล้เต็มแล้ว! กรุณาอัปเกรดแพ็กเกจเพื่อใช้งานต่อ
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}