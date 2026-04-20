import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#07162D] text-slate-400 pt-14 border-t border-slate-400">
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-14 px-4">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-9 h-9 bg-linear-to-br from-[#F6C65B] to-[#D99A1F] rounded-md flex items-center justify-center font-bold text-black text-sm">O</div>
            <span className="font-bold text-lg text-white">AurumIndex</span>
          </div>
          <p className="text-sm">The institutional-grade Gold Market Index & API provider for developers, analysts and shops.</p>
        </div>
        <div className="text-[13px]">
          <h4 className="text-yellow-500 font-semibold mb-3">Product</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Dashboard</a></li>
            <li><a href="#" className="hover:text-white">Market Sentiment</a></li>
          </ul>
        </div>
        <div className="text-[13px]">
          <h4 className="text-yellow-500 font-semibold mb-3">Developers</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Documentation</a></li>
            <li><a href="#" className="hover:text-white">API Reference</a></li>
            <li><a href="#" className="hover:text-white">Status</a></li>
          </ul>
        </div>
        <div className="text-[13px]">
          <h4 className="text-yellow-500 font-semibold mb-3">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">API Support</a></li>
            <li><a href="#" className="hover:text-white">Terms</a></li>
            <li><a href="#" className="hover:text-white">Privacy</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-full mx-auto py-5 px-4 border-t border-gray-700">
        <ul className="flex space-between space-x-2 text-xs">
          <li className="flex-1">© 2026 AurumIndex Co, Ltd. — All gold prices are reference data.</li>
          <li className="flex">Index data licensed by LBMA partners.</li>
        </ul>
        
      </div>
    </footer>
  );
};

export default Footer;