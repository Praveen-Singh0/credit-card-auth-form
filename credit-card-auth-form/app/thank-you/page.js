"use client";
import React from 'react';
import { CheckCircle, Mail, Phone, Shield } from 'lucide-react';

export default function ThankYouPage({ searchParams = {} }) {
  const customerName = searchParams?.name || 'Valued Customer';
  const merchantName = searchParams?.merchant || 'MyFareDeal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-30" 
           style={{
             backgroundImage: `radial-gradient(circle at 1px 1px, rgb(203 213 225) 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-100/50 border border-white/20 overflow-hidden">
          
          {/* Success Icon */}
          <div className="flex justify-center pt-12 pb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-ping opacity-30"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse opacity-20"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-white relative z-10" />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center px-8 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 bg-clip-text text-transparent mb-4">
              Authorization Complete ✨
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Main Content */}
          <div className="px-8 md:px-12 pb-12">
            
            {/* Greeting */}
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
                Hello {customerName} 👋
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Your payment authorization has been successfully processed 🎉
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 mb-8 border border-purple-100 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-10 transform translate-x-8 -translate-y-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-400 to-cyan-400 rounded-full opacity-10 transform -translate-x-6 translate-y-6"></div>
              
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-2">
                  <Shield className="w-6 h-6 text-white flex-shrink-0" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3">
                    🔒 Verification Process
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                    For your security, our Payment Verification team may require additional 
                    documentation. You will receive notifications through the channels below.
                  </p>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">📧 Email</p>
                    <a 
                      href="mailto:bookings@myfaredeal.com"
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors hover:underline"
                    >
                      bookings@myfaredeal.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-2">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">📞 Phone</p>
                    <p className="text-slate-700 font-medium text-sm"> +1-844-480-0252 </p>
                  </div>
                </div>
              </div>
            </div>



            {/* Footer */}
            <div className="text-center">
              <p className="text-slate-500 text-xs md:text-sm">
                © 2025 <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{merchantName}</span>. All rights reserved. 
                <span className="block md:inline md:ml-2 mt-1 md:mt-0">
                  🔐 Secured by advanced encryption
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Simple decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-40 -z-10"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-cyan-100 to-blue-100 rounded-full opacity-40 -z-10"></div>
      </div>
    </div>
  );
}