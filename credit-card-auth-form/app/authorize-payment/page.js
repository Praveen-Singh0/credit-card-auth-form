'use client';

export const dynamic = 'force-dynamic'; // 🔴 This tells Next.js to skip pre-rendering

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthorizePaymentPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Redirect to backend for processing
      window.location.href = `http://localhost:3001/authorize-payment?token=${token}`;
    }
  }, [token]);

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
