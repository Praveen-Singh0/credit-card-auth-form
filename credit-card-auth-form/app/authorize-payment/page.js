"use client";
import { useEffect, useState } from 'react';

// Modern Loader Component
function ModernLoader({ stage = 'loading', message = 'Loading...' }) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
        {/* Animated Logo/Icon Area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 rounded-full animate-spin" style={{animationDuration: '1s'}}></div>
            </div>
            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
        </div>

        {/* Status Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            Processing Your Authorization{dots}
          </h2>
          
          <div className="text-slate-600 leading-relaxed space-y-2">
            <p>Please wait while we confirm your payment authorisation.</p>
            <p>You will be redirected shortly.</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              stage === 'loading' ? 'bg-green-500 animate-pulse' : 'bg-green-500'
            }`}></div>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              stage === 'processing' ? 'bg-green-500 animate-pulse' : 
              stage === 'redirecting' ? 'bg-green-500' : 'bg-green-300'
            }`}></div>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              stage === 'redirecting' ? 'bg-green-500 animate-pulse' : 'bg-green-300'
            }`}></div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Updated Authorization Content
function AuthorizePaymentContent() {
  // Simulate getting token from URL params using vanilla JS
  const getTokenFromURL = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
    }
    return null;
  };

  const [token, setToken] = useState(null);
  const [stage, setStage] = useState('loading');
  const [message, setMessage] = useState('Preparing your session');

  // Get token on component mount
  useEffect(() => {
    const urlToken = getTokenFromURL();
    setToken(urlToken);
    console.log('Token:', urlToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    // Stage progression for better UX
    const stages = [
      { stage: 'loading', message: 'Preparing your session', duration: 1000 },
      { stage: 'processing', message: 'Verifying payment authorization', duration: 2000 },
      { stage: 'redirecting', message: 'Redirecting to secure portal', duration: 1000 }
    ];

    let currentStageIndex = 0;

    const progressThroughStages = () => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex];
        setStage(currentStage.stage);
        setMessage(currentStage.message);
        
        setTimeout(() => {
          currentStageIndex++;
          if (currentStageIndex < stages.length) {
            progressThroughStages();
          } else {
            // Final redirect
            window.location.href = `https://api.myfaredeal.us/authorize-payment?token=${token}`;
          }
        }, currentStage.duration);
      }
    };

    progressThroughStages();
  }, [token]);

  if (!token) {
    return <ModernLoader stage="loading" message="Initializing secure session" />;
  }

  return <ModernLoader stage={stage} message={message} />;
}

export default function AuthorizePaymentPage() {
  return <AuthorizePaymentContent />;
}