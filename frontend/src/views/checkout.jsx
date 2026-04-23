"use client";

import React, { useState } from 'react';

const Checkout = () => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-20 flex items-center justify-center">
      {/* กล่องนี้กล่องเดียวพอครับ ใส่ animate-fade-up ตรงนี้เลย */}
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fade-up">
        
        <h1 className="text-2xl font-bold text-black mb-6">Complete your purchase</h1>
        
        {/* Order Summary */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600">Pro Tier Subscription</span>
            <span className="font-bold text-black">฿99.00</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>VAT (7%)</span>
            <span>฿6.93</span>
          </div>
          <hr className="my-4 border-slate-200" />
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-black font-extrabold">Total</span>
            <span className="text-yellow-600">฿105.93</span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Cardholder Name</label>
            <input type="text" className="w-full px-4 py-3 mt-1 text-slate-900 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all" placeholder="Athitaya Phuengpian" />
          </div>
        </div>

        {/* ปุ่มจ่ายเงิน (มี Loading state ในตัวเดียว) */}
        <button 
          onClick={handlePay}
          disabled={processing}
          className={`w-full bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] text-black font-bold py-4 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {processing ? (
             <span className="flex items-center justify-center gap-2">
               <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin-custom"></div> 
               Processing...
             </span>
          ) : 'Pay ฿105.93 Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;