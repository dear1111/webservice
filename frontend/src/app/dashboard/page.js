"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Squares2X2Icon,
  KeyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

const mockShops = [
  { name: "ฮั่วเซ่งเฮง (เยาวราช)", fee: "฿500", trend: "ถูกที่สุด" },
  { name: "ทองสมสมัย", fee: "฿550", trend: "คงที่" },
  { name: "ออโรร่า", fee: "฿620", trend: "คงที่" },
  { name: "แม่ทองสุก", fee: "฿650", trend: "แพงขึ้น" },
  { name: "YLG Bullion", fee: "฿680", trend: "คงที่" },
];

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [activeKeyCount, setActiveKeyCount] = useState(0);
  const [totalUsage, setTotalUsage] = useState(0);
  
  // 🌟 เพิ่ม State สำหรับจัดการกราฟ
  const [timeframe, setTimeframe] = useState("1D");
  const [dailyData, setDailyData] = useState([]); // เก็บของจริง 1 วันไว้ จะได้ไม่ต้องโหลดใหม่
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        window.location.href = "/login";
        return;
      }
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // 1. Usage Stats
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/keys/${parsedUser.id}`);
        if (response.ok) {
          const keysFromDB = await response.json();
          setActiveKeyCount(keysFromDB.length);
          setTotalUsage(keysFromDB.reduce((sum, key) => sum + (key.usage || 0), 0));
        }
      } catch (error) { console.error(error); }

      // 2. ข้อมูลกราฟจริง (1 วัน)
      try {
        const cgRes = await fetch("https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=thb&days=1");
        const cgData = await cgRes.json();
        
        const rawPrices = cgData.prices;
        const formattedData = [];
        const step = Math.floor(rawPrices.length / 12); 

        for (let i = 0; i < rawPrices.length; i += step) {
          const item = rawPrices[i];
          const date = new Date(item[0]);
          const pricePerBaht = (item[1] / 31.1035) * 15.244;
          formattedData.push({
            time: date.getHours().toString().padStart(2, '0') + ":00",
            actual: Math.round(pricePerBaht / 10) * 10,
          });
        }
        
        const lastItem = rawPrices[rawPrices.length - 1];
        const lastPrice = Math.round(((lastItem[1] / 31.1035) * 15.244) / 10) * 10;
        
        formattedData.push({
          time: "ตอนนี้",
          actual: lastPrice,
        });

        setDailyData(formattedData); // เก็บไว้ใน state สำรอง
        setChartData(formattedData);
        setCurrentPrice(lastPrice);
      } catch (error) { console.error(error); }
    };
    loadData();
  }, []);

  // 🌟 ฟังก์ชันจัดการตอนเปลี่ยน Timeframe 1 วัน / 1 ปี
  const handleTimeframeChange = (tf) => {
    if (tf === "1Y" && user.plan_id < 2) {
      // ถ้าเป็น Free Tier ให้เด้ง Alert
      Swal.fire({
        icon: 'warning',
        title: 'ฟีเจอร์สำหรับ Plus & Pro',
        text: 'ดูข้อมูลย้อนหลัง 1 ปีได้เฉพาะแพ็กเกจ Plus และ Pro ขึ้นไปเท่านั้นครับ',
        confirmButtonColor: '#F6C65B',
        confirmButtonText: 'รับทราบ'
      });
      return;
    }

    setTimeframe(tf);
    if (tf === "1Y") {
      // 🌟 สร้าง Mock Data 1 ปี โดยอิงจากราคาปัจจุบันเป็นตัวจบ
      const base = currentPrice > 0 ? currentPrice : 41000;
      const mock1YearData = [
        { time: "พ.ค. 68", actual: base - 6000 },
        { time: "มิ.ย. 68", actual: base - 5500 },
        { time: "ก.ค. 68", actual: base - 5200 },
        { time: "ส.ค. 68", actual: base - 4800 },
        { time: "ก.ย. 68", actual: base - 4500 },
        { time: "ต.ค. 68", actual: base - 3000 },
        { time: "พ.ย. 68", actual: base - 2500 },
        { time: "ธ.ค. 68", actual: base - 2000 },
        { time: "ม.ค. 69", actual: base - 1500 },
        { time: "ก.พ. 69", actual: base - 1000 },
        { time: "มี.ค. 69", actual: base - 500 },
        { time: "ปัจจุบัน", actual: base },
      ];
      setChartData(mock1YearData);
    } else {
      // กลับมาใช้ข้อมูลจริง 1 วันที่โหลดไว้แล้ว
      setChartData(dailyData);
    }
  };

  const handleCancelPlan = () => {
    Swal.fire({
      title: "ยืนยันการยกเลิก?",
      text: "ระบบจะปรับคุณกลับไปเป็น Free Tier ทันที",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ใช่, ยกเลิก!",
      cancelButtonText: "ปิด",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUser = { ...user, plan_id: 1 };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event("userUpdated"));
        
        // ถ้าอยู่หน้า 1 ปี แล้วกดยกเลิกแพ็กเกจ ให้เด้งกลับมา 1 วัน
        if (timeframe === "1Y") {
            setTimeframe("1D");
            setChartData(dailyData);
        }

        Swal.fire("ยกเลิกแล้ว", "", "success");
      }
    });
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">Loading...</div>;

  const planInfo = user.plan_id === 3 ? { name: "Pro Tier 🏆", badge: "bg-purple-50 text-purple-700 border-purple-200" } :
                   user.plan_id === 2 ? { name: "Plus Tier ⚡", badge: "bg-amber-50 text-amber-700 border-amber-200" } :
                   { name: "Free Tier 💡", badge: "bg-slate-100 text-slate-600 border-slate-200" };

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
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black shadow-lg">
                <Squares2X2Icon className="w-5 h-5" /> Overview
              </button>
              <Link href="/api-keys" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all">
                <KeyIcon className="w-5 h-5" /> API Keys
              </Link>
              <Link href="/api-keys?tab=Usage" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all">
                <ChartBarIcon className="w-5 h-5" /> Usage Metrics
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8 animate-fade-up">
          <header className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0B152A]">Dashboard</h1>
              <p className="text-slate-500">{user.email}</p>
            </div>
            {isDanger && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ChartBarIcon className="w-5 h-5 text-red-600 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-700">Warning: High API Usage</h4>
                    <p className="text-xs text-red-600/80">
                      คุณใช้งานไปแล้ว {percentUsed.toFixed(1)}% ({totalUsage.toLocaleString()} / {maxLimit.toLocaleString()})
                    </p>
                  </div>
                </div>
                <Link href="/pricing" className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all">
                  Upgrade Plan
                </Link>
              </div>
            )}
            <div className={`flex items-center justify-between px-5 py-3 rounded-2xl shadow-sm border ${planInfo.badge}`}>
              <span className="text-sm font-bold">Current Plan: {planInfo.name}</span>
              {user.plan_id > 1 && (
                <button onClick={handleCancelPlan} className="text-xs font-bold text-red-500 bg-white px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-all">
                  Cancel Plan
                </button>
              )}
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <ChartBarIcon className="w-6 h-6 text-yellow-500 mb-4" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calls Today</p>
              <p className="text-2xl font-bold text-black mt-1">{totalUsage.toLocaleString()} <span className="text-xs opacity-40">/ {maxLimit.toLocaleString()}</span></p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <ArrowTrendingUpIcon className="w-6 h-6 text-yellow-500 mb-4" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latency</p>
              <p className="text-2xl font-bold text-black mt-1">187ms</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <KeyIcon className="w-6 h-6 text-yellow-500 mb-4" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Keys</p>
              <p className="text-2xl font-bold text-black mt-1">{activeKeyCount}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <ShieldCheckIcon className="w-6 h-6 text-yellow-500 mb-4" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Uptime</p>
              <p className="text-2xl font-bold text-black mt-1">99.9%</p>
            </div>
          </div>

          {/* Real Graph */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 h-[420px] shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0B152A] mb-3">Market Data Overview</h3>
                {/* 🌟 ปุ่ม Toggle สลับ 1 วัน / 1 ปี */}
                <div className="flex bg-slate-100 p-1 rounded-lg w-max">
                  <button
                    onClick={() => handleTimeframeChange('1D')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${timeframe === '1D' ? 'bg-white shadow text-[#0B152A]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    1 วัน (Live)
                  </button>
                  <button
                    onClick={() => handleTimeframeChange('1Y')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${timeframe === '1Y' ? 'bg-white shadow text-[#0B152A]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    1 ปี (Mock) {user?.plan_id < 2 && <LockClosedIcon className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Price</span>
                <span className="text-2xl font-bold text-amber-500">฿{currentPrice.toLocaleString()}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="75%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6C65B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F6C65B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis orientation="right" domain={['dataMin - 100', 'dataMax + 100']} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `฿${v.toLocaleString()}`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Area type="monotone" dataKey="actual" fill="url(#colorActual)" stroke="#D99A1F" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shop Ranking (Plus) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              {user.plan_id < 2 && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <LockClosedIcon className="w-10 h-10 text-slate-400 mb-2" />
                <p className="font-bold text-slate-700">Plus Feature Only</p>
              </div>}
              <h3 className="text-lg font-bold text-[#0B152A] mb-4 flex items-center gap-2">
                <BuildingStorefrontIcon className="w-6 h-6 text-amber-500" /> Lowest Making Charges
              </h3>
              <div className="space-y-3">
                {mockShops.map((shop, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-700 text-sm">{i+1}. {shop.name}</span>
                    <div className="text-right">
                      <span className="text-amber-600 font-bold block">{shop.fee}</span>
                      <span className="text-[10px] text-slate-400">{shop.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Forecast (Pro) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              {user.plan_id < 3 && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                <LockClosedIcon className="w-10 h-10 text-slate-400 mb-2" />
                <p className="font-bold text-slate-700">Pro Feature Only</p>
              </div>}
              <h3 className="text-lg font-bold text-[#0B152A] mb-4 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-purple-500" /> AI Gold Forecast
              </h3>
              <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 mb-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-purple-900">Sentiment Score</span>
                  <span className="text-2xl font-black text-green-600">+14</span>
                </div>
                <p className="text-[11px] text-purple-700/80 leading-relaxed">
                  วิเคราะห์จากโมเมนตัม: ราคาปัจจุบันทะลุแนวต้านสำคัญที่ 73,000 บาท แรงซื้อจากปัจจัยภูมิรัฐศาสตร์และแนวโน้มเฟดลดดอกเบี้ย ส่งผลให้มีโอกาสไปต่อสูง
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ราคาคาดการณ์ (สัปดาห์หน้า)</span>
                  <p className="text-lg font-bold text-slate-800 mt-1">฿74,500</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Market Trend</span>
                  <p className="text-lg font-bold text-green-500 mt-1">Strong Bullish ↗</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}