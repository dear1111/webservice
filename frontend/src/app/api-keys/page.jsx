"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Squares2X2Icon, KeyIcon, ChartBarIcon, PlusIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function ApiKeysContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Keys");
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        window.location.href = "/login";
        return;
      }
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const fetchApiKeys = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiUrl}/keys/${parsedUser.id}`);
        if (response.ok) {
          const keysFromDB = await response.json();
          setApiKeys(keysFromDB); // อัปเดตข้อมูลล่าสุดเข้า State
        }
      } catch (error) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", error);
      }
    };

    // โหลดครั้งแรกทันทีตอนเปิดหน้า
    fetchApiKeys();

    // 🌟 ตั้งเวลา (Polling) ให้ดึงข้อมูลใหม่ทุกๆ 3 วินาที (3000 ms)
    const intervalId = setInterval(fetchApiKeys, 3000);

    // คลีนอัปเมื่อผู้ใช้ออกจากหน้านี้ (ปิด Interval ทิ้ง จะได้ไม่กินแรม)
    return () => clearInterval(intervalId);
    };
    loadData();
  }, []);

  const generateNewKey = async () => {
    try {
      if (!user) return;
      setIsGenerating(true);
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
      } else {
        alert("สร้าง API Key ไม่สำเร็จ");
      }
    } catch (error) {
      console.error("สร้าง Key ไม่สำเร็จ:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const maxLimit = user?.plan_id === 3 ? 100000 : user?.plan_id === 2 ? 10000 : 1000;
  const percentUsed = Math.min((totalUsage / maxLimit) * 100, 100);
  const isDanger = percentUsed >= 90; 

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <div className="flex-grow max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row gap-8 p-6">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <div className="bg-[#0A1D3A] rounded-3xl p-6 text-white shadow-2xl sticky top-6">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
              Microservices
            </h2>
            <nav className="space-y-2">
              <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer">
                <Squares2X2Icon className="w-5 h-5" /> Overview
              </Link>
              <button 
                onClick={() => setActiveTab("Keys")} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Keys" ? "bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"}`}
              >
                <KeyIcon className="w-5 h-5" /> API Keys
              </button>
              <button 
                onClick={() => setActiveTab("Usage")} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "Usage" ? "bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"}`}
              >
                <ChartBarIcon className="w-5 h-5" /> Usage Metrics
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6 animate-fade-up">
          {/* 🌟 ดึง H1 ออกมาไว้ข้างนอก กล่องจะได้ไม่ขยับ */}
          <h1 className="text-3xl font-bold text-[#0B152A]">
            {activeTab === "Keys" ? "API Keys Management" : "API Keys Usage"}
          </h1>

          {activeTab === "Keys" ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-black">Your Secret Keys</h2>
                <button onClick={generateNewKey} disabled={isGenerating} className={`bg-yellow-500 text-black px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all cursor-pointer ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <PlusIcon className="w-5 h-5" /> {isGenerating ? "Generating..." : "Generate New Key"}
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="text-slate-400 text-xs uppercase border-b border-slate-100">
                    <tr>
                      <th className="pb-4 font-bold">Name</th>
                      <th className="pb-4 font-bold">Secret Key</th>
                      <th className="pb-4 font-bold text-right">Usage</th>
                      <th className="pb-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {apiKeys.map((item) => {
                      const keyUsage = item.usage || 0;
                      const keyPercent = Math.min((keyUsage / maxLimit) * 100, 100);
                      const isKeyDanger = keyPercent >= 90;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-black">{item.name}</td>
                          <td className="py-4 font-mono text-xs text-slate-500">{item.key}</td>
                          <td className="py-4 pr-6 text-right">
                            <div className="flex flex-col gap-1 w-28 ml-auto">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span className={isKeyDanger ? "text-red-500" : ""}>{keyUsage.toLocaleString()}</span>
                                <span>{maxLimit.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${isKeyDanger ? "bg-red-500" : "bg-yellow-500"}`}
                                  style={{ width: `${keyPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button onClick={() => copyToClipboard(item.key, item.id)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${copiedId === item.id ? "bg-green-100 text-green-600" : "text-amber-600 hover:bg-amber-50"}`}>
                              {copiedId === item.id ? "Copied!" : <><DocumentDuplicateIcon className="w-4 h-4" /> Copy</>}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {apiKeys.length === 0 && (
                       <tr><td colSpan="4" className="py-8 text-center text-slate-400">No API Keys found. Generate one to start.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
              <ChartBarIcon className={`w-16 h-16 mx-auto mb-4 ${isDanger ? 'text-red-500 animate-bounce' : 'text-slate-200'}`} />
              <h2 className="text-2xl font-bold mb-2">Usage Statistics</h2>
              <p className="text-slate-500 mb-8">You have used <b className="text-black">{totalUsage.toLocaleString()}</b> requests out of your {maxLimit.toLocaleString()} limit.</p>
              
              <div className="max-w-md mx-auto">
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${isDanger ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'}`} style={{ width: `${percentUsed}%` }}></div>
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

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ApiKeysContent />
    </Suspense>
  );
}