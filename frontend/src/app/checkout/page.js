"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. สร้าง Component ย่อยเพื่อจัดการเนื้อหา (และเพื่อหลบ Error ของ useSearchParams)
const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const planQuery = searchParams.get("plan"); // ดึงค่าจาก URL (เช่น ?plan=plus)

  const [processing, setProcessing] = useState(false);
  const [cardName, setCardName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // กำหนดข้อมูลแพ็กเกจ
  const plans = {
    plus: { id: 2, name: "Plus Tier Subscription", price: 39 },
    pro: { id: 3, name: "Pro Tier Subscription", price: 99 },
  };

  const selectedPlan = plans[planQuery] || plans.pro;
  const vat = selectedPlan.price * 0.07;
  const total = selectedPlan.price + vat;

  // 🌟 รวม useEffect เข้าด้วยกัน และใช้ setTimeout เพื่อแก้บั๊กตัวแดง (Cascading renders)
  useEffect(() => {
    const loadUserData = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setCardName(userData.name || "");
        setUserEmail(userData.email || "");
      }
    }, 0);

    return () => clearTimeout(loadUserData);
  }, []);

  const handlePay = () => {
    if (!cardName.trim()) {
      alert("กรุณากรอกชื่อผู้ถือบัตร");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const userObj = JSON.parse(storedUserStr);

        // อัปเดตแพ็กเกจใหม่
        userObj.plan_id = selectedPlan.id;
        userObj.plan_name = selectedPlan.id === 3 ? "Pro Tier" : "Plus Tier";

        // เซฟทับลง LocalStorage
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      // บังคับเปลี่ยนหน้าไป Dashboard
      window.location.href = "/dashboard";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-20 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-black mb-6">
          Complete your purchase
        </h1>

        {/* Order Summary */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600">{selectedPlan.name}</span>
            <span className="font-bold text-black">
              ฿{selectedPlan.price.toFixed(2)}
            </span>
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
          <form
            onSubmit={(e) => {
              e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช
              handlePay(); // เรียกฟังก์ชันจ่ายเงิน
            }}
          >
            <label className="text-xs font-bold text-slate-400 uppercase">
              Cardholder Name
            </label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-3 mt-1 text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              placeholder="กรอกชื่อ-นามสกุล ตามหน้าบัตร"
            />
            <p className="text-red-500 text-[10px] mt-1">
              * จำเป็นต้องระบุชื่อผู้ถือบัตร
            </p>
          </form>
        </div>

        <button
          type="submit" // 🌟 สำคัญ: ต้องใส่ type="submit"
          disabled={processing}
          className={`w-full mt-6 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black font-bold py-4 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${processing ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

// 2. 🌟 Export หน้าหลัก โดยเอา Component ย่อยมาครอบด้วย Suspense
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
