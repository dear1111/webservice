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
    <nav className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gradient-to-br from-white to-gray-100 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 bg-linear-to-br from-[#F6C65B] to-[#D99A1F] rounded-md flex items-center justify-center font-bold text-black">
          O
        </div>

        <span className="font-bold text-lg text-black">
          Aurum<span className="text-yellow-500">index</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex ml-auto mr-116 space-x-8 text-sm font-medium">
        {navLinks.map((link) => {
          // เช็คว่า path ปัจจุบัน ตรงกับ href ของลิงก์นี้หรือไม่
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors ${isActive
                ? "text-yellow-500 font-bold hover:text-yellow" // สไตล์เมื่อ Active (สีเหลือง ตัวหนา)
                : "text-gray-600 font-bold hover:text-black" // สไตล์ปกติ
                }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {user ? (
          // ถ้า Login แล้ว โชว์ Profile Box, Sign out และ Get API key
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            {/* กล่อง User Profile */}
            <div className="flex items-center gap-2 bg-gray-50 py-1 px-2 rounded-full border border-gray-200">
              <div className="w-7 h-7 bg-gradient-to-br from-[#0B152A] to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner uppercase">
                {user.email ? user.email.charAt(0) : 'U'}
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-xs font-bold text-slate-800 leading-none">
                  {user.email.split('@')[0]}
                </span>
                <span className="text-[9px] font-medium text-amber-600 mt-0.5">
                  {user.plan_name || 'Free Tier'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Sign out
            </button>

            <Link href="/dashboard?tab=API+Keys"
              className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:brightness-90 transition-all shadow-md shadow-[#D99A1F]/50 text-gray-800 px-3 py-2 rounded-md font-semibold text-[11px] inline-block text-center">
              Get API key
            </Link>
          </div>
        ) : (
          // ถ้ายังไม่ Login โชว์ Sign in กับ Get API key เหมือนเดิม
          <>
            <Link href="/login" className="text-xs font-semibold text-gray-600 hover:text-black transition-colors">
              Sign in
            </Link>
            <Link href="/pricing"
              className="bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:brightness-90 transition-all shadow-md shadow-[#D99A1F]/50 text-gray-800 px-3 py-2 rounded-md font-semibold text-[11px] inline-block text-center">
              Get API key
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;