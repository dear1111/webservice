"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const Checkout = () => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // จำลองการโหลดประมวลผลการชำระเงิน 2 วินาที
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-20">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-[#0B152A] mb-6">Complete your purchase</h1>
        
        {/* Order Summary */}
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600">Pro Tier Subscription</span>
            <span className="font-bold text-[#0B152A]">฿99.00</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>VAT (7%)</span>
            <span>฿6.93</span>
          </div>
          <hr className="my-4 border-slate-200" />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-yellow-600">฿105.93</span>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Cardholder Name</label>
            <input type="text" className="w-full px-4 py-3 mt-1 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="Athitaya Phuengpian" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Card Number</label>
            <input type="text" className="w-full px-4 py-3 mt-1 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="1234 5678 9101 1121" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Expiry</label>
              <input type="text" className="w-full px-4 py-3 mt-1 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="MM/YY" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 uppercase">CVC</label>
              <input type="text" className="w-full px-4 py-3 mt-1 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="123" />
            </div>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={processing}
          className="w-full mt-8 bg-gradient-to-br from-[#F6C65B] to-[#D99A1F] hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg"
        >
          {processing ? 'Processing...' : 'Pay ฿105.93 Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;