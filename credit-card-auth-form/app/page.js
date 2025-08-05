"use client";

import React, { useState, useRef, useEffect } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
    setName(params.get("name") || "");
  }, []);

  const [formData, setFormData] = useState({
    bookingReference: "",
    customerEmail: "",
    passengers: [""],
    flightSummary: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingEmail: "",
    contactNo: "",
    address: "",
    amount: "",
    serviceDetails: "",
    authorization: false,
    cardType: "",
    companyName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [chargeBreakdown, setChargeBreakdown] = useState([
    { merchant: "", amount: "" },
    { merchant: "", amount: "" },
    { merchant: "Total", amount: "" },
  ]);

  const [chargeDesc, setChargeDesc] = useState([
    { description_1: "", amount: "" },
  ]);

  // Handler for charge breakdown changes:
  const handleChargeBreakdownChange = (index, field, value) => {
    const updated = [...chargeBreakdown];
    updated[index][field] = value; // Don't restrict input for any field
    setChargeBreakdown(updated);
  };

  // Handle changes to charge description fields
  const handleChargeDescChange = (idx, field, value) => {
    const updatedChargeDesc = chargeDesc.map((item, index) => {
      if (index === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setChargeDesc(updatedChargeDesc);
  };

  // Add a new charge description row
  const addChargeDescRow = () => {
    const newRowNumber = chargeDesc.length + 1;
    setChargeDesc([
      ...chargeDesc,
      { [`description_${newRowNumber}`]: "", amount: "" },
    ]);
  };

  const removeChargeDescRow = (idx) => {
    if (chargeDesc.length > 1) {
      setChargeDesc(chargeDesc.filter((_, index) => index !== idx));
    }
  };

  const editorRef = useRef(null);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Format phone number
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  // Validate form fields
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "cardNumber":
        const cleanCardNumber = value.replace(/\s/g, "");
        if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
          error = "Card number must be 13-19 digits";
        }
        break;
      case "cvv":
        if (value.length < 3 || value.length > 4) {
          error = "CVV must be 3-4 digits";
        }
        break;
      case "expiryDate":
        const [month, year] = value.split("/");
        if (!month || !year || month < 1 || month > 12) {
          error = "Invalid expiry date";
        }
        break;
      case "customerEmail":
      case "billingEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          error = "Invalid email address";
        }
        break;
      case "amount":
        if (value && isNaN(value)) {
          error = "Amount must be a number";
        }
        break;
    }
    return error;
  };

  const handlePassengerChange = (index, value) => {
    const formattedValue = value.toUpperCase();
    const newPassengers = [...formData.passengers];
    newPassengers[index] = formattedValue;
    setFormData((prevState) => ({ ...prevState, passengers: newPassengers }));
  };

  const addPassenger = () => {
    setFormData((prevState) => ({
      ...prevState,
      passengers: [...prevState.passengers, ""],
    }));
  };

  const removePassenger = (index) => {
    const newPassengers = [...formData.passengers];
    newPassengers.splice(index, 1);
    setFormData((prevState) => ({ ...prevState, passengers: newPassengers }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    let formattedValue = value;

    // Apply formatting based on field type
    switch (id) {
      case "cardholderName":
        formattedValue = value.toUpperCase();
        break;
      case "cardNumber":
        formattedValue = formatCardNumber(value);
        if (formattedValue.replace(/\s/g, "").length > 19) return;
        break;
      case "expiryDate":
        formattedValue = formatExpiryDate(value);
        break;
      case "cvv":
        formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4);
        break;
      case "contactNo":
        formattedValue = formatPhoneNumber(value);
        break;
      case "amount":
        formattedValue = value.replace(/[^0-9.]/g, "");
        break;
      case "companyName":
        formattedValue = value;
        break;
    }

    setFormData((prevState) => ({
      ...prevState,
      [id]: type === "checkbox" ? checked : formattedValue,
    }));

    // Validate field
    const error = validateField(id, formattedValue);
    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));
  };

  // Handle rich text editor content changes
  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setFormData((prevState) => ({
        ...prevState,
        flightSummary: content,
      }));
    }
  };

  // Rich text editor functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleEditorChange();
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    const fullData = {
      ...formData,
      chargeBreakdown: chargeBreakdown,
      chargeDescription: chargeDesc,
      email: email,
      name: name,
    };

    console.log("Submitting form data:", fullData);

    try {
      const response = await fetch("https://api.myfaredeal.us/send-email", {
      // const response = await fetch("http://localhost:3081/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Server response:", result);
        alert("Form submitted successfully!");
      } else {
        console.error("Server error:", response.statusText);
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-5">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold"></h1>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p className="text-blue-100">+1-844-480-0252</p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="text-blue-100">bookings@myfaredeal.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-br from-gray-200 to-indigo-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl  text-gray-800 mb-4">
              Credit Card Authorization Form
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Please review all information carefully. Changes and cancellations
              are subject to airline policies. Standard fees may apply for a
              cancellation or refund.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Traveler Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Traveler Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="bookingReference"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Booking Reference *
                  </label>
                  <input
                    type="text"
                    id="bookingReference"
                    value={formData.bookingReference}
                    onChange={handleChange}
                    className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter booking reference"
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerEmail"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className={`text-black w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.customerEmail
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="customer@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Passenger Names
                </label>
                {formData.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        id={`passengerName-${index}`}
                        value={passenger}
                        onChange={(e) =>
                          handlePassengerChange(index, e.target.value)
                        }
                        className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder={`PASSENGER NAME ${index + 1} (AS ON ID)`}
                      />
                    </div>
                    {formData.passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors duration-200 shadow-md"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPassenger}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Passenger
                </button>
              </div>
            </div>

            {/* Flight Summary  Text Editor */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                Flight Summary
              </h3>

              {/* Rich Text Editor Toolbar */}
              <div className="bg-white border-2 border-gray-300 rounded-t-lg p-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => execCommand("bold")}
                  className="px-3 py-1 text-black border border-gray-300 rounded hover:bg-gray-100 font-bold"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("italic")}
                  className="px-3 text-black py-1 border border-gray-300 rounded hover:bg-gray-100 italic"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => execCommand("underline")}
                  className="px-3 text-black py-1 border border-gray-300 rounded hover:bg-gray-100 underline"
                  title="Underline"
                >
                  U
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
              </div>

              {/* Rich Text Editor */}
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleEditorChange}
                onPaste={handleEditorChange}
                className="text-black w-full min-h-32 max-h-64 overflow-y-auto px-4 py-3 bg-white border-2 border-t-0 border-gray-300 rounded-b-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{
                  minHeight: "128px",
                  maxHeight: "400px",
                }}
                suppressContentEditableWarning={true}
                data-placeholder="Enter detailed booking information including flight dates, destinations, and any special requirements. You can paste images, format text, and add links..."
              />
            </div>

            {/* Credit Card Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Credit Card Information
              </h3>

              {/* Card Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Card Type *
                </label>
                <div className="flex flex-wrap gap-3">
                  {["MasterCard", "Visa", "Discover", "AMEX", "Other"].map(
                    (type) => (
                      <button
                        type="button"
                        key={type}
                        className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                          formData.cardType === type
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-md"
                        }`}
                        onClick={() =>
                          setFormData((f) => ({ ...f, cardType: type }))
                        }
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="cardholderName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Cardholder Name (as shown on card) *
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg tracking-wider"
                    placeholder="JOHN DOE"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className={`text-black w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg tracking-widest ${
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength="23"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Expiration Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`text-black w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className={`text-black w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123"
                    maxLength="4"
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Billing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="billingEmail"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="billingEmail"
                    value={formData.billingEmail}
                    onChange={handleChange}
                    className={`text-black w-full px-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.billingEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="billing@example.com"
                  />
                  {errors.billingEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.billingEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contactNo"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Billing Address *
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Street address, City, State/Province, Postal Code, Country"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                Charge Breakdown
                <p className="text-red-500  ml-2 text-sm">{`Optional `}</p>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="font-semibold text-gray-700">
                  Merchant Name(s)
                </div>
                <div className="font-semibold text-gray-700">Amount (USD)</div>
                <div></div>

                {chargeBreakdown.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div>
                      {idx === 0 ? (
                        <select
                          value={item.merchant}
                          onChange={(e) =>
                            handleChargeBreakdownChange(
                              idx,
                              "merchant",
                              e.target.value
                            )
                          }
                          className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Merchant</option>
                          <option value="Myfaredeal">Myfaredeal</option>
                          <option value="Farebulk">Farebulk</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={item.merchant}
                          onChange={(e) =>
                            handleChargeBreakdownChange(
                              idx,
                              "merchant",
                              e.target.value
                            )
                          }
                          className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={`Merchant ${idx + 1}`}
                        />
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={item.amount}
                        onChange={(e) =>
                          handleChargeBreakdownChange(
                            idx,
                            "amount",
                            e.target.value
                          )
                        }
                        className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="a + = 2 "
                      />
                    </div>

                    <div></div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-yellow-200 rounded-lg">
              <div className="mb-4">
                {/* Header with toggle */}
                <div className="flex  items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Charge Descriptions
                  </h3>
                  <p className="text-red-500  ml-2 text-sm">{`Optional `}</p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-blue-600 ml-4 text-lg hover:underline"
                  >
                    {isOpen ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Collapsible content */}
                {isOpen && (
                  <div className="space-y-4 transition-all duration-300 ease-in-out">
                    {chargeDesc.map((item, idx) => {
                      const descriptionKey = Object.keys(item).find((key) =>
                        key.startsWith("description_")
                      );

                      return (
                        <div key={idx} className="mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            {idx === 0 && (
                              <>
                                <div className="font-semibold text-gray-700">
                                  Description
                                </div>
                                <div className="font-semibold text-gray-700">
                                  Amount (USD)
                                </div>
                                <div></div>
                              </>
                            )}

                            <div>
                              <input
                                type="text"
                                value={item[descriptionKey] || ""}
                                onChange={(e) =>
                                  handleChargeDescChange(
                                    idx,
                                    descriptionKey,
                                    e.target.value
                                  )
                                }
                                className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder={`${descriptionKey} ${idx + 1}`}
                              />
                            </div>

                            <div>
                              <input
                                type="text"
                                value={item.amount || ""}
                                onChange={(e) =>
                                  handleChargeDescChange(
                                    idx,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="a + = 2"
                              />
                            </div>

                            <div className="flex gap-2">
                              {idx === chargeDesc.length - 1 && (
                                <button
                                  type="button"
                                  onClick={addChargeDescRow}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                                >
                                  <span className="text-lg">+</span> Add
                                </button>
                              )}

                              {chargeDesc.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeChargeDescRow(idx)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                                >
                                  <span className="text-lg">−</span> Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Charge Details */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Amount (MCO) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">
                      $
                    </span>
                    <input
                      type="text"
                      id="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className={`text-black w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-lg ${
                        errors.amount ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="serviceDetails"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Service Details *
                  </label>
                  <input
                    type="text"
                    id="serviceDetails"
                    value={formData.serviceDetails}
                    onChange={handleChange}
                    className="text-black w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Flight booking, seat upgrade, etc."
                  />
                </div>
              </div>
            </div>

            {/* Authorization Section */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-r-xl p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-red-500 mb-4">
                    {`Note: Before sending the "Authorization (I confirm)" email to the customer, 
    please double-check the merchant name and confirm it with your reporting manager.`}
                  </p>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Merchant Name *
                  </label>
                  <div className="relative w-full">
                    <select
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="appearance-none text-black w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                    >
                      <option value="">Select Merchant</option>
                      <option value="Myfaredeal">Myfaredeal</option>
                      <option value="Farebulk">Farebulk</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    As per our telephonic conversation and as agreed, I,
                    <span className="font-bold text-blue-600">
                      {" "}
                      {formData.cardholderName || "[CUSTOMER NAME]"}{" "}
                    </span>
                    , authorize
                    <span className="font-bold text-blue-600">
                      {" "}
                      {formData.companyName || "[MERCHANT NAME]"}{" "}
                    </span>
                    to charge my above card for USD
                    <span className="font-bold text-green-600">
                      {" "}
                      ${formData.amount || " [AMOUNT]"}{" "}
                    </span>{" "}
                    for{" "}
                    <span className="font-bold text-blue-600">
                      {formData.serviceDetails || " [SERVICE]"}
                    </span>
                    . I understand that this charge is non-refundable.You may
                    see above charges in split, however total remains same
                    Booking purchased are non-transferable. Name changes are not
                    permitted.
                    <span className="font-bold text-blue-600">
                      {" "}
                      {formData.serviceDetails || " [SERVICE]"}{" "}
                    </span>
                    I understand that this charge is non-refundable. You may see
                    above charges in split, however total remains same. Booking
                    purchased are non-transferable. Name changes are not
                    permitted. Date/Route/Time change may incur penalty plus
                    difference in fare.
                  </p>

                  {/* Customer Signature */}
                  <div className="bg-gray-50 rounded-xl p-6 mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Customer Signature
                    </h3>
                    <div>
                      <label
                        htmlFor="customerSignature"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Customer Signature *
                      </label>
                      <input
                        type="text"
                        id="customerSignature"
                        value={formData.cardholderName}
                        className="text-black w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-signature text-2xl"
                        placeholder="Type your full name as signature"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        By typing your name above, you agree to the terms and
                        conditions and authorize the transaction.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 mx-auto
      ${
        isSubmitting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
                    // disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Authorization"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Terms & Conditions */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Terms &amp; Conditions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 space-y-0">
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Travelers Name
                  </h4>
                  <p className="leading-relaxed">
                    Traveler First name and Last name must be entered during the
                    time of reservation exactly as it appears on your Government
                    issued Identification, be it your passport, Driving License
                    or other acceptable forms of identification depending on
                    your type of travel (Domestic/International). Name once
                    entered will not be changed. Some &apos;Typo Error&apos;
                    (Name Correction) is allowed, depending on Airline Terms of
                    Use, &amp; charges would be applicable according as per
                    airline policy.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Fare Policy
                  </h4>
                  <p className="leading-relaxed mb-3">
                    All Tickets are not guaranteed until ticketed. The fare may
                    alter as revised by the Airline company or matter anytime
                    even after the confirmation of a reservation. Myfaredeal
                    will inform you about the fare changes if made without
                    assuming and responsibility- financial or otherwise for any
                    such fare alters made by the supplier.
                  </p>
                  <p className="leading-relaxed">
                    Myfaredeal will inform you about the new fares. At that
                    point of time you may- depending on your requirement- either
                    purchase or cancel the product or service at the new cost.
                    You also can cancel the booking at no cost in case there is
                    increase in fare before ticketing and your card being
                    charged. You&apos;ll be charged nothing if you cancel such a
                    booking.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Payment Policy
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Myfaredeal accepts Debit Cards and Credit Cards.
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      All prices are displayed in US$.
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Myfaredeal may divide your total charge into two parts:
                      Taxes and Airline Base. But, the combined total amount
                      will be the same as authorized and quoted by you at the
                      time of booking.
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Ticket fare doesn&apos;t includes baggage fees of airline.
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Tickets are guaranteed only after the ticketing is
                      completed. The tickets will not be guaranteed upon
                      submission of payment. In case, your credit card payment
                      fails to proceed due to any reason, we will notify you
                      about this within 24 hours.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Third Party and International Credit &amp; Debit Cards
                    Payment
                  </h4>
                  <p className="leading-relaxed mb-3">
                    In case you are using an International Debit Card or Credit
                    while purchasing Plane Tickets for personal journey, or for
                    somebody else, you need to have some specific documents for
                    processing passenger E-Tickets. Documents required for the
                    same have been mentioned below:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      A complete &apos;Credit Card Authorization Form&apos;.
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      A copy of identity proof issued by Government with front
                      and back side which has photograph and signatures.
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Airline Ticket price are not guaranteed until ticketed.
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Credit Card Declines
                  </h4>
                  <p className="leading-relaxed">
                    On Credit Card being declined while processing your
                    transaction, we will alert you about this by email to your
                    valid email id within 24 to 48 hours. In this case, neither
                    the transaction will be processed nor the fare and any other
                    booking details will be guaranteed.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Cancellations and Exchanges
                  </h4>
                  <p className="leading-relaxed mb-3">
                    For all cancellation and exchanges, you agree to request at
                    least 24 hours before scheduled departure. All flight
                    tickets bought from us are 100% non-refundable. You,
                    however, reserve the right to certain refund or exchange if
                    allowed by the airline fare rules associated with the
                    ticket(s) issued to you. Your ticket(s) may be refunded or
                    exchanged for the original purchase price after the
                    deduction of applicable airline penalties, and any fare
                    difference between the original fares paid and the fare
                    associated with the new ticket(s). Furthermore, Myfaredeal
                    has the right to change a Charge/Refund fees. Myfaredeal has
                    no control over airline penalties associated with refunds or
                    exchanges.
                  </p>
                  <p className="leading-relaxed">
                    If you travel internationally, you may often be offered to
                    travel in more than one airline. Each airline has formed its
                    own set of fare rules. If more than one set of fare rules
                    are applied to the total fare, the most restrictive rules
                    will be applicable to the entire booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
