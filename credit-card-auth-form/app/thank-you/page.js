export default function ThankYouPage({ searchParams }) {
  const customerName = searchParams?.name || 'Valued Customer';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 px-6 text-center">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            CREDIT CARD AUTHORIZATION
          </h1>
        </div>

        {/* Main Content */}
        <div className="p-12 text-center">
          {/* Greeting */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Dear {customerName}
          </h2>

          {/* Thank You Box */}
          <div className="border-2 border-gray-300 p-8 mb-8 bg-gray-50">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Thanks For Authorization
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              For your protection, our Authorized Payment Verification department may require additional 
              documentation. Please check your email for a notification from,{' '}
              <a 
                href="mailto:Authorization@reservationdesk.info" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Authorization@reservationdesk.info
              </a>{' '}
              We may also contact you via the phone number on file.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600">
            <p>
              © 2020-2021{' '}
              <span className="text-blue-600 font-semibold">Flight Services</span>{' '}
              All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}