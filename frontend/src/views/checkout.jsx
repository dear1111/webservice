"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // ✅ นำเข้าตัวช่วยอ่าน URL

const Checkout = () => {
  const searchParams = useSearchParams();
  const planQuery = searchParams.get('plan'); // ดึงค่าจาก URL (เช่น ?plan=plus)

  const [processing, setProcessing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // ✅ กำหนดข้อมูลแพ็กเกจไว้ตรงนี้
  const plans = {
    plus: { id: 2, name: 'Plus Tier Subscription', price: 39 },
    pro: { id: 3, name: 'Pro Tier Subscription', price: 99 }
  };

  // เช็คว่าเลือกแพ็กไหนมา (ถ้าพิมพ์ URL มั่ว ให้ default เป็น Pro)
  const selectedPlan = plans[planQuery] || plans.pro;

  // คำนวณ VAT และราคาสุทธิ
  const vat = selectedPlan.price * 0.07;
  const total = selectedPlan.price + vat;

  useEffect(() => {
    // 2. ดึงชื่อ User จากฐานข้อมูล (LocalStorage) มาเป็นค่าเริ่มต้น
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // ถ้ามีชื่อในระบบอยู่แล้ว ให้เอามาใส่ในช่องกรอกเลย
      setCardName(userData.name || '');
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserEmail(JSON.parse(storedUser).email);
    }
  }, []);

  const handlePay = () => {
    if (!cardName.trim()) {
      alert("กรุณากรอกชื่อผู้ถือบัตร");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      // 1. ดึงข้อมูล User เดิมออกมา
      const storedUserStr = localStorage.getItem('user');
      if (storedUserStr) {
        const userObj = JSON.parse(storedUserStr);

        // 2. 🌟 อัปเดตค่าให้ตรงกับที่ Dashboard/Navbar ใช้
        // สมมติว่าหน้า Dashboard เช็กคำว่า plan_name หรือ plan_id
        userObj.plan_id = selectedPlan.id;
        userObj.plan_name = selectedPlan.id === 3 ? "Pro Tier" : "Plus Tier";

        // 3. เซฟทับลงไปใน Key เดิม ('user')
        localStorage.setItem('user', JSON.stringify(userObj));
      }

      // 4. บังคับ Refresh ไปหน้า Dashboard เพื่อให้มันโหลดค่าใหม่จาก LocalStorage
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-20 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-up">

        <h1 className="text-2xl font-bold text-black mb-6">Complete your purchase</h1>

        {/* Order Summary */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600">{selectedPlan.name}</span>
            <span className="font-bold text-black">฿{selectedPlan.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>VAT (7%)</span>
            <span>฿{vat.toFixed(2)}</span>
          </div>
          {userEmail && (
            <div className="flex justify-between items-center text-xs text-slate-400 mt-2 pt-2 border-t border-slate-200">
              <span>Account</span>
              <span>{userEmail}</span>
            </div>
          )}
          <hr className="my-4 border-slate-200" />
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-black font-extrabold">Total</span>
            <span className="text-yellow-600">฿{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Input Fields */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Cardholder Name</label>
          <input
            type="text"
            required // บังคับว่าต้องกรอก
            value={cardName} // ผูกค่ากับ State
            onChange={(e) => setCardName(e.target.value)} // พิมพ์แล้วอัปเดต State
            className="w-full px-4 py-3 mt-1 text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            placeholder="กรอกชื่อ-นามสกุล ตามหน้าบัตร" // นี่คือ Placeholder ครับ
          />
          <p className="text-red-500 text-[10px] mt-1">* จำเป็นต้องระบุชื่อผู้ถือบัตร</p>
        </div>

        <button
          onClick={handlePay}
          disabled={processing}
          className={`w-full bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black font-bold py-4 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : `Pay ฿${total.toFixed(2)} Now`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;