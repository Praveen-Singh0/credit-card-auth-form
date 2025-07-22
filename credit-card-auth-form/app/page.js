"use client";

import Image from "next/image";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    bookingReference: '',
    customerEmail: '', 
    passengers: [''],
    bookingDetails: '',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingEmail: '',
    contactNo: '',
    address: '',
    amount: '',
    serviceDetails: '',
    authorization: false,
    customerSignature: '',
    cardType: '', // new
    companyName: '', // new
  });

  const handlePassengerChange = (index, value) => {
    const newPassengers = [...formData.passengers];
    newPassengers[index] = value;
    setFormData(prevState => ({ ...prevState, passengers: newPassengers }));
  };

  const addPassenger = () => {
    setFormData(prevState => ({ ...prevState, passengers: [...prevState.passengers, ''] }));
  };

  const removePassenger = (index) => {
    const newPassengers = [...formData.passengers];
    newPassengers.splice(index, 1);
    setFormData(prevState => ({ ...prevState, passengers: newPassengers }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    try {
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Server response:', result);
        alert('Form submitted successfully!');
      } else {
        console.error('Server error:', response.statusText);
        alert('Failed to submit the form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

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

        <form onSubmit={handleSubmit}>
          {/* Traveler Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Traveler Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700">Booking Reference</label>
                <input type="text" id="bookingReference" value={formData.bookingReference} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
                <input type="email" id="customerEmail" value={formData.customerEmail} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
            <div className="mt-6">
                 {formData.passengers.map((passenger, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                        <div className="flex-grow">
                            <label htmlFor={`passengerName-${index}`} className="block text-sm font-medium text-gray-700">Passenger's Name {index + 1}</label>
                            <input
                                type="text"
                                id={`passengerName-${index}`}
                                value={passenger}
                                onChange={(e) => handlePassengerChange(index, e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        {formData.passengers.length > 1 && (
                             <button type="button" onClick={() => removePassenger(index)} className="self-end mb-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600">-</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addPassenger} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Add More</button>
            </div>
          </div>

          {/* Booking Details */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Booking Details</h3>
            <textarea
              id="bookingDetails"
              rows="4"
              value={formData.bookingDetails}
              onChange={handleChange}
              placeholder="Enter booking details..."
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Credit Card Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Credit Card Information</h3>
            <div className="flex gap-2 mb-4">
              {['MasterCard', 'Visa', 'Discover', 'AMEX', 'Other'].map(type => (
                <button
                  type="button"
                  key={type}
                  className={`px-4 py-2 rounded border ${formData.cardType === type ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => setFormData(f => ({ ...f, cardType: type }))}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">Cardholder Name (as shown on card)</label>
                <input type="text" id="cardholderName" value={formData.cardholderName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" id="cardNumber" value={formData.cardNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiration Date (MM/YY)</label>
                <input type="text" id="expiryDate" value={formData.expiryDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                <input type="text" id="cvv" value={formData.cvv} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Billing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="billingEmail" value={formData.billingEmail} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">Contact No</label>
                <input type="text" id="contactNo" value={formData.contactNo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea id="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
            </div>
          </div>

           {/* Charge Details */}
          <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Charge Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (USD)</label>
                        <input type="text" id="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="serviceDetails" className="block text-sm font-medium text-gray-700">Service Details</label>
                        <input type="text" id="serviceDetails" value={formData.serviceDetails} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>
           </div>

          {/* Authorization */}
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                id="cardholderName"
                value={formData.cardholderName}
                onChange={handleChange}
                placeholder="Customer Name"
                className="mb-2"
              />
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="mb-2"
              />
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount (USD)"
                className="mb-2"
              />
              <input
                type="text"
                id="serviceDetails"
                value={formData.serviceDetails}
                onChange={handleChange}
                placeholder="Service Details"
                className="mb-2"
              />
              <p className="text-sm text-gray-700">
                As per our telephonic conversation and as agreed I, <b>{formData.cardholderName || 'Customer Name'}</b>, authorize <b>{formData.companyName || 'Company Name'}</b> to charge my above card for USD <b>{formData.amount || '____'}</b> as per given details for <b>{formData.serviceDetails || 'Service Details'}</b>. I understand that this charge is non-refundable. I also understand that any changes or cancellation may incur penalty plus difference in fare.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="customerSignature" className="block text-sm font-medium text-gray-700">Customer Signature</label>
            <input type="text" id="customerSignature" value={formData.customerSignature} onChange={handleChange} placeholder="Digital signature or type your name" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div className="text-center">
            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold">SEND NOW</button>
          </div>
        </form>

        {/* Terms & Conditions */}
        <div className="mt-12 text-xs text-gray-500 space-y-4">
            <h3 className="font-bold text-sm text-gray-800 mb-2">Terms & Conditions</h3>
            
            <div>
                <h4 className="font-bold">Travelers Name</h4>
                <p>Traveler First name and Last name must be entered during the time of reservation exactly as it appears on your Government issued Identification, be it your passport, Driving License or other acceptable forms of identification depending on your type of travel (Domestic/International). Name once entered will not be changed. Some 'Typo Error' (Name Correction) is allowed, depending on Airline Terms of Use, & charges would be applicable according as per airline policy.</p>
            </div>

            <div>
                <h4 className="font-bold">Fare Policy</h4>
                <p>All Tickets are not guaranteed until ticketed. The fare may alter as revised by the Airline company or matter anytime even after the confirmation of a reservation. Flight Services will inform you about the fare changes if made without assuming and responsibility- financial or otherwise for any such fare alters made by the supplier.</p>
                <p>Flight Services will inform you about the new fares. At that point of time you may- depending on your requirement- either purchase or cancel the product or service at the new cost. You also can cancel the booking at no cost in case there is increase in fare before ticketing and your card being charged. You'll be charged nothing if you cancel such a booking.</p>
            </div>

            <div>
                <h4 className="font-bold">Payment Policy</h4>
                <ul className="list-disc list-inside">
                    <li>Flight Services accepts Debit Cards and Credit Cards.</li>
                    <li>All prices are displayed in US$.</li>
                    <li>Flight Services may divide your total charge into two parts: Taxes and Airline Base. But, the combined total amount will be the same as authorized and quoted by you at the time of booking.</li>
                    <li>Ticket fare doesn't includes baggage fees of airline.</li>
                    <li>Tickets are guaranteed only after the ticketing is completed. The tickets will not be guaranteed upon submission of payment. In case, your credit card payment fails to proceed due to any reason, we will notify you about this within 24 hours.</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold">Third Party and International Credit & Debit Cards Payment</h4>
                <p>In case you are using an International Debit Card or Credit while purchasing Plane Tickets for personal journey, or for somebody else, you need to have some specific documents for processing passenger E-Tickets. Documents required for the same have been mentioned below:</p>
                <ul className="list-disc list-inside ml-4">
                    <li>A complete 'Credit Card Authorization Form'.</li>
                    <li>A copy of identity proof issued by Government with front and back side which has photograph and signatures.</li>
                    <li>Airline Ticket price are not guaranteed until ticketed.</li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold">Credit Card Declines</h4>
                <p>On Credit Card being declined while processing your transaction, we will alert you about this by email to your valid email id within 24 to 48 hours. In this case, neither the transaction will be processed nor the fare and any other booking details will be guaranteed.</p>
            </div>

            <div>
                <h4 className="font-bold">Cancellations and Exchanges</h4>
                <p>For all cancellation and exchanges, you agree to request at least 24 hours before scheduled departure. All flight tickets bought from us are 100% non-refundable. You, however, reserve the right to certain refund or exchange if allowed by the airline fare rules associated with the ticket(s) issued to you. Your ticket(s) may be refunded or exchanged for the original purchase price after the deduction of applicable airline penalties, and any fare difference between the original fares paid and the fare associated with the new ticket(s). Furthermore, Flight Services has the right to change a Charge/Refund fees. Flight Services has no control over airline penalties associated with refunds or exchanges.</p>
                <p>If you travel internationally, you may often be offered to travel in more than one airline. Each airline has formed its own set of fare rules. If more than one set of fare rules are applied to the total fare, the most restrictive rules will be applicable to the entire booking.</p>
            </div>

            <p>Thanks for spending your valuable time and using Flight Services. For using the website, you are authorized to agree with the aforementioned 'Terms of Use'. If you are reluctant or don't agree with any of the conditions, you are not authorized to use this website.</p>
        </div>
      </div>
    </div>
  );
}
