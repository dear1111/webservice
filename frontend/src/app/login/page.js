"use client";

import React, { useState } from 'react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessLoading, setIsSuccessLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    
    if ((!isLogin || isForgotMode) && password !== confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน กรุณาพิมพ์ใหม่");
      setPassword('');
      setConfirmPassword('');
      return;
    }

    setLoading(true);

    try {
      // 🌟 ใช้ตัวแปรนี้เป็นหลัก (ถ้าของจริงรันบนไหน มันจะดึงจาก .env มาให้เอง)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

      if (isForgotMode) {
        const response = await fetch(`${apiUrl}/reset-password`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, newPassword: password }),
        });
        const data = await response.json();
        if (response.ok) {
          setIsForgotMode(false); 
          setPassword(''); 
          setConfirmPassword('');
          setErrorMessage(''); 
          setSuccessMessage("");
        } else {
          setErrorMessage(data.error);
          setPassword('');
          setConfirmPassword('');
        }
      } else if (isLogin) {
        // 🌟 แก้ตรงนี้! เปลี่ยนจาก Hardcode localhost เป็นใช้ ${apiUrl}
        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsSuccessLoading(true);
          window.location.href = '/dashboard';
        } else {
          setErrorMessage(`เข้าสู่ระบบไม่ได้: ${data.error}`);
          setPassword('');
          setSuccessMessage("");
        }

      } else {
        // โหมด Register
        const response = await fetch(`${apiUrl}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage("Registration successful! Please sign in.");
          setIsLogin(true); 
          setPassword(''); 
          setConfirmPassword(''); 
          setErrorMessage(''); 
        } else {
          setErrorMessage(`สมัครไม่สำเร็จ: ${data.error}`);
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage("");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccessLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500 text-lg animate-pulse">
        กำลังพาท่านเข้าสู่ระบบ...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-up">

          {/* แถบปุ่มสลับโหมด Login / Register */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setErrorMessage(''); setPassword(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setErrorMessage(''); setPassword(''); setConfirmPassword(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Register
            </button>
          </div>

          <h1 className="text-2xl font-bold text-black mb-2">
            {isLogin ? (isForgotMode ? 'Reset Password' : 'Welcome back') : 'Create an account'}
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            {isLogin ? (isForgotMode ? 'Enter your new password.' : 'Enter your details to access your dashboard.') : 'Start building with our API today.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ช่อง Full Name */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="ex.Somsri Sawasdee" />
              </div>
            )}

            {/* ช่อง Email */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="ex.you@company.com" disabled={isForgotMode && email !== ''} />
            </div>

            {/* ช่อง Password */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">{isForgotMode ? 'New Password' : 'Password'}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="••••••••" />
            </div>

            {/* ช่อง Confirm Password */}
            {(!isLogin || isForgotMode) && (
              <div className="animate-fade-up">
                <label className="text-xs font-bold text-slate-400 uppercase">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="••••••••" />
              </div>
            )}

            {/* ลืมรหัสผ่าน */}
            {isLogin && !isForgotMode && (
              <div className="flex justify-end">
                <button type="button" onClick={() => { setIsForgotMode(true); setErrorMessage(''); setPassword(''); }} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors cursor-pointer">
                  Forgot password?
                </button>
              </div>
            )}

            {/* ข้อความ Error / Success */}
            {errorMessage && (
              <div className="text-red-500 text-xs font-bold text-center mt-2 animate-fade-up bg-red-50 p-2 rounded-lg border border-red-100">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-emerald-600 text-xs font-bold text-center mt-2 animate-fade-up bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 bg-[#0B152A] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:bg-black hover:-translate-y-1 active:scale-[0.98] cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing in...' : 'Processing...'}
                </span>
              ) : (
                isForgotMode ? 'Reset Password' : (isLogin ? 'Sign In' : 'Create Account')
              )}
            </button>
          </form>

          {isForgotMode && (
            <div className="text-center mt-4">
              <button type="button" onClick={() => { setIsForgotMode(false); setErrorMessage(''); setPassword(''); setConfirmPassword(''); }} className="text-sm text-slate-500 hover:text-black font-semibold transition-colors cursor-pointer">
                ← Back to Login
              </button>
            </div>
          )}

          {!isForgotMode && (
             <div className="mt-8 pt-6 border-t border-slate-100 text-center">
               <p className="text-sm text-slate-500">
                 {isLogin ? "Don't have an account? " : "Already have an account? "}
                 <button type="button" onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); setPassword(''); }} className="font-bold text-yellow-600 hover:text-yellow-700 transition-colors cursor-pointer">
                   {isLogin ? "Sign up" : "Log in"}
                 </button>
               </p>
             </div>
          )}
        </div>
      </div>
    </>
  );
}