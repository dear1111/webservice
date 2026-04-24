"use client";

import { useRouter } from 'next/navigation';
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
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  // const [apiKeys, setApiKeys] = useState([
  //   { id: 1, name: 'Production Key', key: 'ai_live_8f92a4b1c3d5...', created: 'Oct 12, 2025', usage: 850 },
  //   { id: 2, name: 'Testing Key', key: 'ai_test_2a9b4c1d8f7e...', created: 'Nov 01, 2025', usage: 120 }
  // ]);
  const [apiKeys, setApiKeys] = useState([]);
  const [liveChartData, setLiveChartData] = useState(chartData);

  useEffect(() => {
    // เช็คว่ามี user ไหม
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      // ถ้าไม่มี เตะกลับไปหน้า Login
      router.push('/login');
    } else {
      // ถ้ามี ให้ผ่านได้ (ปิดโหมดเช็ค)
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
        // 1. ดึงข้อมูล User ออกมาก่อน เพื่อให้รู้ว่าต้องขอดู Key ของใคร
        const savedUserString = localStorage.getItem('user');
        if (!savedUserString) return; // ถ้าไม่ได้ล็อกอิน ก็ข้ามไป
        
        const savedUser = JSON.parse(savedUserString);
        if (!savedUser.id) return; // กันเหนียว ถ้ายูสเซอร์ไม่มี id

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        // 2. ยิงไปที่ Backend เพื่อขอข้อมูล (สังเกตว่าเราต่อ /รหัสยูสเซอร์ ไปใน URL ด้วย)
        const response = await fetch(`${apiUrl}/keys/${savedUser.id}`);
        
        if (response.ok) {
          const keysFromDB = await response.json();
          // 3. เอาข้อมูลจริงที่ได้ อัปเดตใส่ State
          setApiKeys(keysFromDB);
        } else {
          console.error("ดึงข้อมูล API Keys ไม่สำเร็จ");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึง API Keys:", error);
      }
    };

    fetchApiKeys(); // สั่งให้ทำงาน
  }, []); // [] หมายถึงทำแค่ครั้งเดียวตอนโหลดหน้า

  // ระหว่างที่คอมพิวเตอร์กำลังคิด ขอโชว์หน้าจอขาวๆ หรือ Loading ไปก่อน จะได้ไม่ Error
  if (isChecking) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Loading Dashboard...</div>;
  }


  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    alert("API Key copied!");
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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

              {/* ใส่ div ครอบ Grid ให้ถูกต้อง */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Calls Today', value: '450', icon: ChartBarIcon },
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
              <div className="bg-white p-8 rounded-3xl border border-slate-100 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={liveChartData}>
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Area type="monotone" dataKey="actual" fill="#EAB308" stroke="#EAB308" />
                    <Line type="monotone" dataKey="projected" stroke="#94a3b8" strokeDasharray="5 5" dot={false} />
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