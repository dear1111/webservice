"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    // ดึง path ปัจจุบัน (เช่น '/', '/pricing', '/dashboard')
  const pathname = usePathname();

  // สร้าง Array ของเมนูเพื่อให้จัดการโค้ดและเช็คเงื่อนไขได้ง่ายขึ้น
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Docs', href: '/docs' },
    { name: 'Support', href: '/support' },
  ];
  
  return (
    <nav className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 bg-linear-to-br from-[#F6C65B] to-[#D99A1F] rounded-md flex items-center justify-center font-bold text-black">O</div>
        <span className="font-bold text-lg text-black">Aurum<span className="text-yellow-500">index</span></span>
      </div>
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8 text-sm font-medium">
        {navLinks.map((link) => {
          // เช็คว่า path ปัจจุบัน ตรงกับ href ของลิงก์นี้หรือไม่
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors ${
                isActive 
                  ? 'text-yellow-500 font-bold hover:text-black' // สไตล์เมื่อ Active (สีเหลือง ตัวหนา)
                  : 'text-gray-600 font-bold hover:text-black' // สไตล์ปกติ
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Link href="/signin" className="text-xs font-semibold text-gray-600 hover:bg-[#D99A1F] transition-colors">
          Sign in
        </Link>
        <button className="bg-linear-to-br from-[#F6C65B] to-[#D99A1F] hover:opacity-90 text-gray-800 px-3 py-2 rounded-md text-xs font-bold transition-colors">
          Get API key
        </button>
      </div>
    </nav>
  );
};

export default Navbar;