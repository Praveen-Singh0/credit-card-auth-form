'use client';

import { useEffect } from 'react';

export default function AuthorizePaymentPage() {

  const token = "testing"

  useEffect(() => {
      // Redirect to backend for processing
      window.location.href = `https://api.easyflightnow.com/authorize-payment?token=${token}`;
    
  }, []);

  if (!token) {
  return <p>Loading...</p>;
}


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Processing Your Authorization...</h1> 
        <p className="text-gray-600">Please wait while we confirm your payment authorization.</p>
        <p className="text-gray-600 mt-2">You will be redirected shortly.</p>
      </div>
    </div>
  );
}
