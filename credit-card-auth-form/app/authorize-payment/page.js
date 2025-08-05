'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AuthorizePaymentContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  console.log('Token:', token);

  useEffect(() => {
    if (token) {
      window.location.href = `https://api.myfaredeal.us/authorize-payment?token=${token}`;
      // window.location.href = `http://localhost:3081/authorize-payment?token=${token}`;

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

export default function AuthorizePaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthorizePaymentContent />
    </Suspense>
  );
}