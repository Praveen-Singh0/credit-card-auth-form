
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Flight Services</h1>
          <div className="text-right">
            <p className="text-gray-600">1-888-446-0033</p>
            <p className="text-gray-600">support@flightservices.ca</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Credit Card Authorization Form</h2>
          <p className="text-gray-500 mt-2">
            Please review all information carefully. Changes and cancellations are subject to airline policies. Standard fees may apply for a cancellation or refund. Standard fee may apply.
          </p>
        </div>

        <form>
          {/* Traveler Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Traveler Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700">Booking Reference</label>
                <input type="text" id="bookingReference" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
                <input type="email" id="customerEmail" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700">Passenger's Name</label>
                <input type="text" id="passengerName" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="self-end">
                <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Add More</button>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Booking Details</h3>
            {/* Booking details will be added here */}
          </div>

          {/* Credit Card Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Credit Card Information</h3>
            <div className="flex items-center space-x-4 mb-4">
              <Image src="/visa.png" alt="Visa" width={40} height={25} />
              <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} />
              <Image src="/amex.png" alt="Amex" width={40} height={25} />
              <Image src="/discover.png" alt="Discover" width={40} height={25} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">Cardholder Name (as shown on card)</label>
                <input type="text" id="cardholderName" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" id="cardNumber" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiration Date (MM/YY)</label>
                <input type="text" id="expiryDate" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                <input type="text" id="cvv" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Billing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="billingEmail" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">Contact No</label>
                <input type="text" id="contactNo" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea id="address" rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
            </div>
          </div>

          {/* Authorization */}
          <div className="mb-8 p-4 bg-yellow-100 border-l-4 border-yellow-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <input id="authorization" name="authorization" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  I agree to the terms and conditions and go ahead with the charges on my above card for USD ____. As per given details for ___. To change my above card for USD ____.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="customerSignature" className="block text-sm font-medium text-gray-700">Customer Signature</label>
            <input type="text" id="customerSignature" placeholder="Digital signature or type your name" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div className="text-center">
            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold">SEND NOW</button>
          </div>
        </form>

        {/* Terms & Conditions */}
        <div className="mt-12 text-xs text-gray-500">
          <h3 className="font-bold text-sm text-gray-800 mb-2">Terms & Conditions</h3>
          <p className="mb-2">Tickets are Non-Refundable/Non-Transferable and name changes are not permitted.</p>
          <p className="mb-2">Date and routing changes will be subject to Airline Penalty and Fare Difference if any.</p>
          <p className="mb-2">Fares are not guaranteed until ticketed.</p>
          <p className="mb-2">For any modification or changes please contact our Travel Consultant on 1-888-446-0033.</p>
          {/* Add more terms and conditions as needed */}
        </div>
      </div>
    </div>
  );
} 