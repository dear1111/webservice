"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Squares2X2Icon, KeyIcon, ChartBarIcon, PlusIcon, DocumentDuplicateIcon, ArrowTrendingUpIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';
import "../app/globals.css";

const chartData = [
  { time: '00:00', actual: 2365.12, projected: 2372.40 }, { time: '02:00', actual: 2373.10, projected: 2395.50 }, { time: '04:00', actual: 2396.30, projected: 2402.50 },
  { time: '06:00', actual: 2408.90, projected: 2425.25 }, { time: '08:00', actual: 2384.20, projected: 2390.10 }, { time: '10:00', actual: 2369.90, projected: 2375.10 },
  { time: '12:00', actual: 2358.90, projected: 2362.10 }, { time: '14:00', actual: 2362.16, projected: 2370.60 }, { time: '16:00', actual: 2373.10, projected: 2377.20 },
  { time: '18:00', actual: 2391.52, projected: 2408.23 }, { time: '20:00', actual: 2412.80, projected: 2418.90 }, { time: '23:00', actual: 2428.90, projected: 2438.50 },
];

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [apiKeys, setApiKeys] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [liveChartData, setLiveChartData] = useState(chartData);
  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const getPlanDetails = (planId) => {
    // สมมติว่าดึง plan_id มาจาก user ใน localStorage (ถ้ายังไม่มีข้อมูล ให้ default เป็น 1)
    const id = Number(planId) || 1;

    if (id === 3) return { name: 'Pro Tier 🏆', badge: 'bg-purple-100 text-purple-700' };
    if (id === 2) return { name: 'Plus Tier ⚡', badge: 'bg-[#F6C65B]/20 text-[#D99A1F]' };
    return { name: 'Free Tier 💡', badge: 'bg-slate-100 text-slate-700' };
  };

  // สมมติว่าดึงค่ามาจาก localStorage (ตอนใช้งานจริง Backend ต้องส่ง plan_id มาพร้อมตอน Login)
  const [userPlan, setUserPlan] = useState({ name: 'Loading...', badge: 'bg-slate-100 text-slate-700' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
    } else {
      // 🌟 ดึงข้อมูลจาก LocalStorage มาแปลงเป็น Object
      const parsedUser = JSON.parse(savedUser);

      // 🌟 เอา plan_id จากที่ User ซื้อ มาเช็กกับฟังก์ชัน getPlanDetails (ถ้าไม่มีให้เป็น 1)
      const currentPlanDetails = getPlanDetails(parsedUser.plan_id || 1);

      // 🌟 อัปเดต State ให้โชว์ Plan ปัจจุบัน
      setUserPlan(currentPlanDetails);

      setIsChecking(false);
    }
  }, [router]);
  useEffect(() => {
    const fetchRealGoldPrice = async () => {
      try {
        // ยิง API ฟรีไปที่ CoinGecko ขอข้อมูลย้อนหลัง 1 วัน
        const response = await fetch('https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=thb&days=1');
        const data = await response.json();

        // API จะส่งข้อมูลมาเยอะมาก (ทุกๆ 5 นาที) เราจะเอามาจัดรูปแบบใหม่
        const formattedData = data.prices.map((item) => {
          const date = new Date(item[0]); // item[0] คือเวลา (Timestamp)
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const pricePerOunceTHB = item[1];
          const pricePerThaiBaht = pricePerOunceTHB * (15.244 / 31.10348);

          const actualPrice = parseFloat(item[1].toFixed(2)); // item[1] คือราคา

          return {
            time: `${hours}:${minutes}`,
            actual: actualPrice,
            // จำลองเส้น Projected คาดการณ์ล่วงหน้า (ราคาจริง +- นิดหน่อยให้กราฟดูมีมิติ)
            projected: parseFloat((actualPrice * (1 + (Math.random() * 0.002 - 0.001))).toFixed(2))
          };
        });

        // เนื่องจากข้อมูล 1 วันมีเกือบ 300 จุด กราฟจะรกไป 
        // เราเลยกรองเอามาโชว์แค่บางจุด (เอามาประมาณ 12 จุดล่าสุด)
        const simplifiedData = formattedData.filter((_, index) => index % 24 === 0).slice(-12);

        setLiveChartData(simplifiedData); // อัปเดตกราฟด้วยข้อมูลจริง!
      } catch (error) {
        console.error("ดึงข้อมูลราคาทองไม่สำเร็จ:", error);
      }
    };

    // สั่งให้ทำงานทันที ไม่ต้องรอ
    fetchRealGoldPrice();
  }, []); // ปีกกาว่างๆ แปลว่าให้ดึงแค่รอบเดียวตอนเปิดหน้าเว็บ

  // useEffect สำหรับดึง API Keys จาก Database
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const savedUserString = localStorage.getItem('user');
        if (!savedUserString) return;
        const savedUser = JSON.parse(savedUserString);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/keys/${savedUser.id}`);

        if (response.ok) {
          const keysFromDB = await response.json();
          setApiKeys(keysFromDB);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    // ดึงข้อมูลครั้งแรกทันที
    fetchApiKeys();

    // 🌟 ตั้งเวลาให้ดึงใหม่ทุกๆ 5 วินาที (5000ms)
    const interval = setInterval(fetchApiKeys, 5000);

    // 🌟 สำคัญมาก: ต้องล้าง interval ทิ้งเมื่อปิดหน้าเว็บ ไม่งั้นเครื่องจะค้าง
    return () => clearInterval(interval);
  }, []);

  // useEffect สำหรับเช็คว่ามี ?tab=... ส่งมาใน URL ไหม
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    // ถ้ามีส่งมา และชื่อตรงกับ Tab ที่เรามี ก็สลับให้เลย
    if (tabFromUrl && ['Overview', 'API Keys', 'Usage Metrics'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // ระหว่างที่คอมพิวเตอร์กำลังคิด ขอโชว์หน้าจอขาวๆ หรือ Loading ไปก่อน จะได้ไม่ Error
  if (isChecking) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Loading Dashboard...</div>;
  }


  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id); // เก็บ ID ที่ถูกกด

    // 2 วินาทีให้กลับเป็นเหมือนเดิม
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const generateNewKey = async () => {
    try {
      // 1. ดึงข้อมูล User ปัจจุบันที่ล็อกอินอยู่จาก localStorage
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (!savedUser || !savedUser.id) {
        console.error("หาข้อมูล User ไม่เจอ");
        return;
      }

      // 2. ตั้งชื่อ Key ให้รันตัวเลขไปเรื่อยๆ
      const keyName = `Service Key ${apiKeys.length + 1}`;

      // 3. ยิงไปให้ Backend สุ่มรหัสและบันทึกลง DB
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://shiny-space-winner-vprp94qgjxvcpv4r-5000.app.github.dev/api';
      const response = await fetch(`${apiUrl}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: savedUser.id, name: keyName })
      });

      if (response.ok) {
        const newKeyFromDB = await response.json();
        // 4. เอา Key ของจริงที่ได้จาก DB มาใส่ในตาราง
        setApiKeys([...apiKeys, newKeyFromDB]);
      } else {
        console.error("สร้าง Key ไม่สำเร็จ");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  };

  const handleCancelPlan = () => {
    // ถามเพื่อความชัวร์
    if (window.confirm("Are you sure you want to cancel your current plan and return to Free Tier?")) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.plan_id = 1; // 🌟 ปรับกลับเป็น Free Tier
        userObj.plan_name = "Free Tier";
        localStorage.setItem('user', JSON.stringify(userObj));

        // 🌟 อัปเดต State ทันทีเพื่อให้หน้าเว็บเปลี่ยนเลยโดยไม่ต้องรีเฟรช
        setUserPlan(getPlanDetails(1));
        alert("Your plan has been successfully canceled.");
      }
    }
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
                {/* ป้ายบอกสถานะแพ็กเกจ (Plan Badge) */}
                <div className={`flex items-center justify-between px-5 py-3 rounded-2xl shadow-sm ${userPlan.badge}`}>
                  <span className="text-sm font-bold">
                    Current Plan: {userPlan.name}
                  </span>

                  {/* ถ้าไม่ใช่ Free Tier ถึงจะโชว์ปุ่ม Cancel ทางด้านขวา */}
                  {userPlan.name !== 'Free Tier 💡' && (
                    <button
                      onClick={handleCancelPlan}
                      className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 bg-white px-4 py-2 rounded-xl border border-red-200 hover:border-red-500 transition-all cursor-pointer"
                    >
                      Cancel Plan
                    </button>
                  )}
                </div>
              </header>


              {/* ใส่ div ครอบ Grid ให้ถูกต้อง */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Calls Today', value: totalUsage.toLocaleString(), icon: ChartBarIcon }, // ใช้ totalUsage แทน "450"
                  { label: 'Latency', value: '187ms', icon: ArrowTrendingUpIcon },
                  { label: 'Active Keys', value: apiKeys.length, icon: KeyIcon },
                  { label: 'Uptime', value: '99.9%', icon: ShieldCheckIcon }
                ].map((s) => (
                  <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <s.icon className="w-6 h-6 text-yellow-500 mb-4" />
                    <p className="text-[10px] text-slate-800 font-bold uppercase tracking-wider">
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold text-black mt-1">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div> {/* ปิด div ของ Grid ตรงนี้สำคัญมาก */}

              {/* กราฟควรอยู่แยกออกมาเป็นอีกบล็อกด้านล่าง */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 h-[400px] shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#0B152A]">Live Gold Price </h3>
                  <p className="text-xs text-slate-400">Real-time market chart (THB / Baht weight)</p>
                </div>
                <ResponsiveContainer width="100%" height="83%">
                  <ComposedChart data={liveChartData} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                    {/* เพิ่ม defs สำหรับไล่สี Area ให้ดูพรีเมียม */}
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F6C65B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F6C65B" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="time" stroke="#000000" fontSize={12} tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} tickMargin={10} />

                    {/* 🌟 พระเอกอยู่ตรงนี้: ทำให้แกน Y ซูมเข้าไปที่ราคาจริงๆ ไม่เริ่มจาก 0 */}
                    <YAxis
                      domain={['dataMin - 100', 'dataMax + 100']}
                      stroke="#000000"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => `฿${value.toLocaleString()}`}
                    />

                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#0B152A' }}
                    />

                    <Area type="monotone" dataKey="actual" fill="url(#colorActual)" stroke="#D99A1F" strokeWidth={3} />
                    <Line type="monotone" dataKey="projected" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {activeTab === 'API Keys' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-black">API Keys</h1>
                <button onClick={generateNewKey} className="bg-[#0B152A] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all cursor-pointer">
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
                      <td className="p-4 font-bold text-black">{item.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">{item.key}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            {/* ปรับให้ขยับตาม usage จริง */}
                            <div
                              className="h-full bg-yellow-500 transition-all duration-500"
                              style={{ width: `${Math.min((item.usage / 1000) * 100, 100)}%` }}
                            ></div>
                          </div>
                          {/* เพิ่มตัวเลขเข้าไปตรงนี้ */}
                          <span className="text-[10px] font-bold text-slate-500">
                            {item.usage?.toLocaleString()} / 1,000
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => copyToClipboard(item.key, item.id)}
                          className={`flex items-center justify-end gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-200 ${copiedId === item.id
                              ? "bg-green-100 text-green-600 shadow-sm"
                              : "text-amber-600 hover:bg-amber-50 active:scale-95"
                            }`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <DocumentDuplicateIcon className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'Usage Metrics' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm text-center py-20">
              <ChartBarIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-black">Usage Statistics</h2>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                You have used <b>{totalUsage.toLocaleString()}</b> requests out of your 1,000 daily limit.
              </p>
              {/* เพิ่มหลอดใหญ่ๆ ให้ดูง่าย */}
              <div className="max-w-md mx-auto mt-8">
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-1000"
                    style={{ width: `${(totalUsage / 1000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                  <span>0%</span>
                  <span>{(totalUsage / 1000 * 100).toFixed(1)}% used</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;