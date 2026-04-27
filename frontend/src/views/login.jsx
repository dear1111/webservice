"use client";

import React, { useState } from 'react';

const Login = () => {
  // State สำหรับสลับโหมดต่างๆ
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State ใหม่ตามสเต็ป A
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessLoading, setIsSuccessLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // เคลียร์ Error เก่าก่อนทำงาน
    
    // --- โหมดลืมรหัสผ่าน หรือ Register: เช็ครหัสผ่านให้ตรงกันก่อน ---
    if ((!isLogin || isForgotMode) && password !== confirmPassword) {
      setErrorMessage("รหัสผ่านไม่ตรงกัน กรุณาพิมพ์ใหม่");
      // ล้างช่องรหัสผ่านให้กรอกใหม่
      setPassword('');
      setConfirmPassword('');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://shiny-space-winner-vprp94qgjxvcpv4r-5000.app.github.dev/api';

      if (isForgotMode) {
        // --- โหมดลืมรหัสผ่าน ---
        const response = await fetch(`${apiUrl}/reset-password`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, newPassword: password }),
        });

        const data = await response.json();
        if (response.ok) {
          // สำเร็จ: เด้งกลับไปหน้าล็อกอินปกติและแจ้งให้ล็อกอินใหม่
          setIsForgotMode(false); 
          setPassword(''); 
          setConfirmPassword('');
          setErrorMessage(''); 
          setSuccessMessage("");
          // แอบใส่ข้อความสีเขียวได้นิดหน่อย แต่ตอนนี้เราใช้แดงเป็นหลัก เลยปล่อยผ่านไปก่อน
        } else {
          // ไม่สำเร็จ: แจ้ง error และเคลียร์ช่องรหัส
          setErrorMessage(data.error);
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage("");
        }
      } else if (isLogin) {
        // --- โหมด Login ---
        const response = await fetch(`http://localhost:5000/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('user', JSON.stringify(data.user));
          // สเต็ป C: เปลี่ยน state เป็นโหลดสำเร็จ
          setIsSuccessLoading(true);
          window.location.href = '/dashboard';
        } else {
          // ไม่สำเร็จ: แจ้งเตือนและเคลียร์ช่องรหัสผ่าน
          setErrorMessage(`เข้าสู่ระบบไม่ได้: ${data.error}`);
          setPassword('');
          setSuccessMessage("");
        }

      } else {
        // --- โหมด Register ---
        const response = await fetch(`${apiUrl}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (response.ok) {
          // ✅ สมัครสำเร็จ: แจ้งเตือน และสลับโหมดกลับมาเป็น Login ทันที!
          setSuccessMessage("Registration successful! Please sign in.");
          setIsLogin(true); // สลับกลับมาหน้า Login
          setPassword(''); // ล้างช่องรหัสผ่านให้กรอกใหม่
          setConfirmPassword(''); // ล้างช่องยืนยันรหัสผ่าน
          setErrorMessage(''); // เคลียร์ Error (ถ้ามี)
        } else {
          // ไม่สำเร็จ: แจ้งเตือนและเคลียร์รหัส
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

  // สเต็ป B: ดักการ return ตรงนี้! (ต้องอยู่เหนือ return ตัวหลักเสมอ)
  if (isSuccessLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500 text-lg animate-pulse">
        กำลังโหลดเว็บ...
      </div>
    );
  }

  // --- โค้ด return ตัวหลัก (หน้าตา UI) ---
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-up">

        {/* แถบปุ่มสลับโหมด Login / Register */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); setPassword(''); }} // ล้าง error ตอนสลับโหมด
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); setPassword(''); setConfirmPassword(''); }} // ล้าง error ตอนสลับโหมด
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

        {/* ฟอร์มกรอกข้อมูล */}
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

          {/* ช่อง Confirm Password (โชว์ตอน Register หรือ ลืมรหัสผ่าน) */}
          {(!isLogin || isForgotMode) && (
            <div className="animate-fade-up">
              <label className="text-xs font-bold text-slate-400 uppercase">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 mt-1 text-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="••••••••" />
            </div>
          )}

          {/* ลืมรหัสผ่าน โชว์แค่หน้า Login */}
          {isLogin && !isForgotMode && (
            <div className="flex justify-end">
              <button type="button" onClick={() => { setIsForgotMode(true); setErrorMessage(''); setPassword(''); }} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>
          )}

          {/* สเต็ป D: โชว์ข้อความ Error สีแดง ถ้ามี */}
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

        {/* ข้อความด้านล่างสุด โชว์เฉพาะตอนไม่ได้อยู่ในโหมดลืมรหัส */}
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
  );
};

export default Login;