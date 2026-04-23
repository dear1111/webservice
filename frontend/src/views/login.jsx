"use client";

import React, { useState } from 'react';

const Login = () => {
  // State สำหรับสลับระหว่างหน้า Login (true) และ Register (false)
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // จำลองการประมวลผล 1.5 วินาที แล้วพาเข้า Dashboard
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-up">
        
        {/* แถบปุ่มสลับโหมด Login / Register */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Register
          </button>
        </div>

        <h1 className="text-2xl font-bold text-black mb-2">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          {isLogin ? 'Enter your details to access your dashboard.' : 'Start building with our API today.'}
        </p>

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ช่อง Full Name จะโชว์ก็ต่อเมื่ออยู่หน้า Register เท่านั้น */}
          {!isLogin && (
            <div className="animate-fade-up">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input type="text" required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Athitaya Phuengpian" />
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input type="email" required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="you@company.com" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input type="password" required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="••••••••" />
          </div>

          {/* ลืมรหัสผ่าน โชว์แค่หน้า Login */}
          {isLogin && (
            <div className="flex justify-end">
              <a href="#" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">Forgot password?</a>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-[#0B152A] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:bg-black hover:-translate-y-1 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-custom"></div> 
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        {/* ข้อความด้านล่างสุด */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
           <p className="text-sm text-slate-500">
             {isLogin ? "Don't have an account? " : "Already have an account? "}
             <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
               {isLogin ? "Sign up" : "Log in"}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;