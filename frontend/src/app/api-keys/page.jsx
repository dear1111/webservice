"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { KeyIcon, ChartBarIcon, PlusIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

// แยก Component ย่อยออกมาเพื่อไม่ให้ Next.js บ่นเรื่อง useSearchParams
function ApiKeysContent() {
  const searchParams = useSearchParams();
  
  // 🌟 ตั้งค่าเริ่มต้นจาก URL เลย ไม่ต้องใช้ useEffect เพื่อแก้บั๊กตัวแดง
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Keys");
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // ใช้ setTimeout (หน่วง 0 วิ) เพื่อสั่งให้การดึงข้อมูลและ setUser ทำงานแบบ Asynchronous
    // วิธีนี้ React จะไม่บ่นเรื่อง Cascading renders อีกต่อไป!
    const checkUser = setTimeout(() => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        window.location.href = "/login";
      }
    }, 0);

    // คืนค่าฟังก์ชันล้างเวลาออก ป้องกัน Memory Leak
    return () => clearTimeout(checkUser);
  }, []);

  // ฟังก์ชันสร้าง Key ใหม่
  const generateNewKey = async () => {
    try {
      if (!user) return;
      const keyName = `Service Key ${apiKeys.length + 1}`;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name: keyName }),
      });
      if (response.ok) {
        const newKeyFromDB = await response.json();
        setApiKeys([...apiKeys, newKeyFromDB]);
      }
    } catch (error) {
      console.error("สร้าง Key ไม่สำเร็จ:", error);
    }
  };

  // ฟังก์ชันกด Copy
  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // คำนวณ Limit และ Usage
  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const maxLimit = user?.plan_id === 3 ? 100000 : user?.plan_id === 2 ? 10000 : 1000;

  const percentUsed = Math.min((totalUsage / maxLimit) * 100, 100);
  const isDanger = percentUsed >= 90; // ถ้าใช้ไป 90% ขึ้นไป ถือว่าอันตราย

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="max-w-[1000px] mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-6 text-[#0B152A]">API Management</h1>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab("Keys")} 
            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "Keys" ? "bg-[#0B152A] text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            API Keys
          </button>
          <button 
            onClick={() => setActiveTab("Usage")} 
            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "Usage" ? "bg-[#0B152A] text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            Usage Metrics
          </button>
        </div>

        {activeTab === "Keys" ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-black">Your Secret Keys</h2>
              <button
                onClick={generateNewKey}
                className="bg-yellow-500 text-black px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all cursor-pointer"
              >
                <PlusIcon className="w-5 h-5" /> Generate New Key
              </button>
            </div>
            
            {/* ตาราง API Keys */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-slate-400 text-xs uppercase border-b border-slate-100">
                  <tr>
                    <th className="pb-4 font-bold">Name</th>
                    <th className="pb-4 font-bold">Secret Key</th>
                    <th className="pb-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apiKeys.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-bold text-black">{item.name}</td>
                      <td className="py-4 font-mono text-xs text-slate-500">{item.key}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => copyToClipboard(item.key, item.id)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${copiedId === item.id ? "bg-green-100 text-green-600" : "text-amber-600 hover:bg-amber-50"}`}
                        >
                          {copiedId === item.id ? "Copied!" : <><DocumentDuplicateIcon className="w-4 h-4" /> Copy</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {apiKeys.length === 0 && (
                     <tr><td colSpan="3" className="py-8 text-center text-slate-400">No API Keys found. Generate one to start.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center animate-fade-up">
            <ChartBarIcon className={`w-16 h-16 mx-auto mb-4 ${isDanger ? 'text-red-500 animate-bounce' : 'text-slate-200'}`} />
            <h2 className="text-2xl font-bold mb-2">Usage Statistics</h2>
            <p className="text-slate-500 mb-8">
              You have used <b>{totalUsage.toLocaleString()}</b> requests out of your {maxLimit.toLocaleString()} limit.
            </p>
            
            {/* กล่องหลอดเปอร์เซ็นต์ */}
            <div className="max-w-md mx-auto">
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  // 🌟 ถ้า isDanger เป็นจริง ให้เปลี่ยนเป็นสีแดง ถ้าไม่ก็สีเหลืองทองเหมือนเดิม
                  className={`h-full transition-all duration-1000 ${
                    isDanger 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  }`} 
                  style={{ width: `${percentUsed}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                <span>0%</span>
                <span className={isDanger ? 'text-red-500' : ''}>
                  {percentUsed.toFixed(1)}% used
                </span>
                <span>100%</span>
              </div>

              {/* 🌟 ข้อความแจ้งเตือนเมื่อใกล้เต็ม */}
              {isDanger && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold animate-pulse">
                  ⚠️ Quota ของคุณใกล้เต็มแล้ว! กรุณาอัปเกรดแพ็กเกจเพื่อใช้งานต่อ
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ครอบด้วย Suspense ป้องกัน Next.js บ่นเรื่อง useSearchParams
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ApiKeysContent />
    </Suspense>
  );
}