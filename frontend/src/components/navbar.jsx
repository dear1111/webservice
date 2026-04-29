"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // เช็คข้อมูลใน localStorage ตอนหน้าเว็บโหลด
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user'); // ลบข้อมูลออก
    setUser(null); // เคลียร์ State
    window.location.href = '/'; // กลับหน้าแรก
  };
  // ดึง path ปัจจุบัน (เช่น '/', '/pricing', '/dashboard')
  const pathname = usePathname();
  // สร้าง Array ของเมนูเพื่อให้จัดการโค้ดและเช็คเงื่อนไขได้ง่ายขึ้น
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Docs", href: "/docs" },
    { name: "Support", href: "/support" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gradient-to-br from-white to-gray-100 sticky top-0 z-50 h-16">
      {/* --- ส่วนที่ 1: ฝั่งซ้าย (Logo) --- */}
      <div className="flex items-center gap-3 w-[250px] flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] rounded-md flex items-center justify-center font-bold text-black shadow-sm">
          O
        </div>
        <span className="font-bold text-lg text-black tracking-tight">
          Aurum<span className="text-yellow-500">index</span>
        </span>
      </div>

      {/* --- ส่วนที่ 2: ตรงกลาง (Navigation Links) --- */}
      {/* ใช้ flex-grow และ justify-center เพื่อให้เมนูอยู่กลางเสมอ ไม่ว่าฝั่งซ้ายขวาจะยาวเท่าไหร่ */}
      <div className="hidden md:flex flex-grow justify-center items-center gap-8 text-sm">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors whitespace-nowrap ${isActive
                  ? "text-yellow-500 font-bold"
                  : "text-gray-600 font-bold hover:text-black"
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* --- ส่วนที่ 3: ฝั่งขวา (Actions) --- */}
      <div className="flex items-center justify-end gap-4 w-[350px] flex-shrink-0">
        {user ? (
          <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
            {/* กล่อง User Profile */}
            <div className="flex items-center gap-2 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-200 min-w-[160px] max-w-[200px]">
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-[#0B152A] to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-inner uppercase">
                {user.email ? user.email.charAt(0) : 'U'}
              </div>
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="text-[11px] font-bold text-slate-800 truncate">
                  {user.email.split('@')[0]}
                </span>
                <span className="text-[8px] font-bold text-amber-600 uppercase tracking-wider">
  {user.plan_id === 3 ? 'Pro Tier' : user.plan_id === 2 ? 'Plus Tier' : 'Free Tier'}
</span>
              </div>
            </div>

            {/* Sign out - เพิ่ม whitespace-nowrap กันตัวหนังสือเด้งลงล่าง */}
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap"
            >
              Sign out
            </button>

            <Link
              href="/dashboard?tab=API+Keys"
              className="w-28 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:brightness-95 active:scale-95 transition-all shadow-sm text-gray-800 py-2 rounded-lg font-bold text-[10px] text-center uppercase"
            >
              Get API key
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-bold text-gray-600 hover:text-black transition-colors whitespace-nowrap">
              Sign in
            </Link>
            <Link href="/pricing"
              className="w-28 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:brightness-95 active:scale-95 transition-all shadow-sm text-gray-800 py-2 rounded-lg font-bold text-[10px] text-center uppercase">
              Get API key
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;