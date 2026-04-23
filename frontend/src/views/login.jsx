"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#050F1F] flex items-center justify-center px-4 font-sans text-white">
      <div className="max-w-md w-full space-y-8 bg-[#0A1D3A] p-10 rounded-3xl shadow-2xl border border-slate-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to AurumIndex</h2>
          <p className="text-sm text-slate-400 mt-2">Sign in to manage your API keys</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 mt-1 bg-[#050F1F] border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                placeholder="developer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 mt-1 bg-[#050F1F] border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            {/* ปุ่มนี้จะพาไปหน้า Dashboard ทันทีเพื่อจำลองการเข้าสู่ระบบสำเร็จ */}
            <Link 
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-black bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:bg-yellow-500 transition-colors"
            >
              Sign In & Continue
            </Link>
          </div>
          
          <div className="text-center text-sm text-slate-400">
            Don&apos;t have an account? <span className="text-yellow-500 cursor-pointer hover:underline">Sign up for free</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;