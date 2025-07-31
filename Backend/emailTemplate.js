const generateEmailTemplate = (data) => {
  const passengersList = data.passengers && data.passengers.length
    ? data.passengers.map(p => `<li style="margin: 5px 0; color: #374151;">${p}</li>`).join('')
    : '<li style="margin: 5px 0; color: #6b7280;">No passengers listed</li>';


     const cleanFlightSummary = (htmlContent) => {
    if (!htmlContent || htmlContent.trim() === '') {
      return '<p style="color: #6b7280; font-style: italic;">No flight details provided</p>';
    }
    
    // Remove any script tags for security
    const cleanHtml = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Ensure proper styling for email compatibility
    return cleanHtml
      .replace(/<p>/g, '<p style="margin: 0 0 10px 0; color: #374151; line-height: 1.6;">')
      .replace(/<h1>/g, '<h1 style="color: #1f2937; margin: 20px 0 10px 0; font-size: 24px; font-weight: 700;">')
      .replace(/<h2>/g, '<h2 style="color: #1f2937; margin: 18px 0 8px 0; font-size: 20px; font-weight: 600;">')
      .replace(/<h3>/g, '<h3 style="color: #1f2937; margin: 16px 0 6px 0; font-size: 18px; font-weight: 600;">')
      .replace(/<ul>/g, '<ul style="margin: 10px 0; padding-left: 20px; color: #374151;">')
      .replace(/<ol>/g, '<ol style="margin: 10px 0; padding-left: 20px; color: #374151;">')
      .replace(/<li>/g, '<li style="margin: 5px 0; color: #374151; line-height: 1.5;">')
      .replace(/<strong>/g, '<strong style="font-weight: 700; color: #1f2937;">')
      .replace(/<em>/g, '<em style="font-style: italic; color: #4b5563;">')
      .replace(/<a /g, '<a style="color: #3b82f6; text-decoration: none;" ')
      .replace(/<img /g, '<img style="max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0;" ')
      .replace(/<table>/g, '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">')
      .replace(/<td>/g, '<td style="padding: 8px; border: 1px solid #e5e7eb; color: #374151;">')
      .replace(/<th>/g, '<th style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f3f4f6; color: #1f2937; font-weight: 600; text-align: left;">')
      .replace(/<div>/g, '<div style="margin: 5px 0;">')
      .replace(/<br>/g, '<br/>');
  };



  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Credit Card Authorization Request</title>
        <style>
        /* Mobile-first responsive styles */
        @media only screen and (max-width: 600px) {
          .container {
            margin: 10px !important;
            border-radius: 8px !important;
          }
          .header {
            padding: 25px 20px !important;
          }
          .header h1 {
            font-size: 22px !important;
            line-height: 1.3 !important;
          }
          .header p {
            font-size: 14px !important;
          }
          .content {
            padding: 25px 20px !important;
          }
          .section-title {
            font-size: 18px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .section-title span {
            margin-right: 0 !important;
            margin-bottom: 5px !important;
          }
          .info-box {
            padding: 20px 15px !important;
            margin-bottom: 25px !important;
          }
          .info-table {
            font-size: 14px !important;
          }
          .info-table td {
            padding: 8px 0 !important;
            display: block !important;
            width: 100% !important;
          }
          .info-table td:first-child {
            font-weight: 700 !important;
            margin-bottom: 3px !important;
            color: #1f2937 !important;
          }
          .amount-row td {
            font-size: 16px !important;
          }
          .auth-text {
            font-size: 14px !important;
            line-height: 1.6 !important;
          }
          .terms-box {
            max-height: 200px !important;
            font-size: 12px !important;
            padding: 15px !important;
          }
          .cta-button {
            padding: 15px 25px !important;
            font-size: 14px !important;
            letter-spacing: 0.5px !important;
          }
          .signature-box {
            padding: 15px !important;
          }
          .signature-text {
            font-size: 16px !important;
            padding: 8px !important;
          }
          .footer {
            padding: 20px 15px !important;
          }
          .welcome-box {
            padding: 15px !important;
            margin-bottom: 25px !important;
          }
          .terms-inner {
            padding: 12px !important;
          }
          .flight-summary-content {
            font-size: 14px !important;
          }
          .flight-summary-content img {
            max-width: 100% !important;
            height: auto !important;
          }
          .flight-summary-content table {
            font-size: 12px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      
      <div class="container" style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header -->
        <div class="header" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%);"></div>
          <div style="position: relative; z-index: 1;">
            <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">
              🔐 Credit Card Authorization
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; font-weight: 400; line-height: 1.4;">
              Please review and authorize your payment details below
            </p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="content" style="padding: 40px 30px;">
          
          <!-- Welcome Message -->
          <div class="welcome-box" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 500; word-break: break-word;">
              Dear ${data.cardholderName || 'Valued Customer'},
            </p>
            <p style="margin: 10px 0 0 0; color: #374151; font-size: 14px; line-height: 1.5;">
              We need your authorization to process the payment for your booking. Please review the details below and click the authorization button to proceed.
            </p>
          </div>

          <!-- Traveler Information Section -->
          <div style="margin-bottom: 35px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">✈️</span> Traveler Information
            </h2>
            <div class="info-box" style="background-color: #f9fafb; padding: 25px; border-radius: 10px; border: 1px solid #e5e7eb;">
              <table class="info-table" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: 600; width: 35%; vertical-align: top;">Booking Reference:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-size: 16px; word-break: break-word;">${data.bookingReference}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Customer Email:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Passenger(s):</td>
                  <td style="padding: 10px 0;">
                    <ul style="margin: 0; padding-left: 20px; color: #374151;">
                      ${passengersList}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Contact Number:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.contactNo || 'Not provided'}</td>
                </tr>
              </table>
            </div>
          </div>
 
          <!-- Booking Details Section -->
          <div style="margin-bottom: 35px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">📋</span> Flight Details
            </h2>
            <div class="info-box" style="background-color: #fefce8; padding: 25px; border-radius: 10px; border: 1px solid #fde047; border-left: 4px solid #eab308;">
              <div class="flight-summary-content" style="color: #374151; font-size: 15px; line-height: 1.7; word-break: break-word;">
                ${cleanFlightSummary(data.flightSummary)}
              </div>
            </div>
          </div>

          <!-- Payment Information Section -->
          <div style="margin-bottom: 35px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">💳</span> Payment Details
            </h2>
            <div class="info-box" style="background-color: #f0fdf4; padding: 25px; border-radius: 10px; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e;">
              <table class="info-table" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; width: 35%; vertical-align: top;">Cardholder Name:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-size: 16px; word-break: break-word;">${data.cardholderName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Card Type:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.cardType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Card Number:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-family: monospace;">**** **** **** ${data.cardNumber.slice(-4)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Expiration Date:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.expiryDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Billing Email:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.billingEmail}</td>
                </tr>
                <tr class="amount-row" style="border-top: 2px solid #dcfce7;">
                  <td style="padding: 15px 0 10px 0; color: #166534; font-weight: 700; font-size: 18px; vertical-align: top;">Total Amount:</td>
                  <td style="padding: 15px 0 10px 0; color: #1f2937; font-weight: 700; font-size: 20px;">USD $${data.amount}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Authorization Agreement Section -->
          <div style="margin-bottom: 35px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
            </h2>
            <div class="info-box" style="background-color: #fef2f2; padding: 25px; border-radius: 10px; border: 1px solid #fecaca; border-left: 4px solid #ef4444;">
              <p class="auth-text" style="margin: 0 0 15px 0; color: #374151; font-size: 15px; line-height: 1.8; text-align: justify; word-break: break-word;">
                As per our telephonic conversation and as agreed, I, <strong>${data.cardholderName}</strong>, 
                authorize <strong>${data.companyName || 'the merchant'}</strong> to charge <strong>USD $${data.amount}</strong> 
                to the above credit card for <strong>${data.serviceDetails}</strong>.
              </p>
              <div class="terms-inner" style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 3px solid #ef4444; margin-top: 15px;">
                <p style="margin: 0; color: #313131ff; font-size: 14px; font-weight: 600;">
                   Important Terms & Conditions:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #374151; font-size: 14px;">
                  <li style="margin: 5px 0;">Tickets are <strong>Non-Refundable/Non-Transferable</strong></li>
                  <li style="margin: 5px 0;">Name changes are <strong>not permitted</strong></li>
                  <li style="margin: 5px 0;">Date/Route/Time changes may incur <strong>penalties plus fare differences</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Signature Section -->
          <div class="signature-box" style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center; border: 2px dashed #cbd5e1;">
            <p style="margin: 0 0 10px 0; color: #475569; font-weight: 600; font-size: 16px;">
              📝 Customer Signature
            </p>
            <p class="signature-text" style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 500; background-color: #ffffff; padding: 10px; border-radius: 6px; display: inline-block; min-width: 200px; word-break: break-word;">
              ${data.cardholderName}
            </p>
          </div>

         <!-- Scrollable Terms & Conditions -->
        <div class="terms-box" style="max-height: 250px; overflow-y: auto; background-color: #fff7ed; border: 1px solid #fde68a; padding: 20px; border-radius: 10px; font-size: 13px; color: #374151; line-height: 1.7; margin-bottom: 30px;">
          <strong>Terms & Conditions</strong><br /><br />
          Tickets are <strong>Non-Refundable/Non-Transferable</strong> and name changes are not permitted.<br />
          Date and routing changes will be subject to Airline Penalty and Fare Difference if any.<br />
          Fares are not guaranteed until ticketed.<br />
          For any modification or changes please contact our Travel Consultant on <strong>+1-844-480-0252</strong>.<br />
          All customers are advised to verify travel documents (transit visa/entry visa) for the country through which they are transiting and/or entering. We will not be responsible if proper travel documents are not available and you are denied entry or transit into a Country.<br />
          We request you to consult the embassy of the country(s) you are visiting or transiting through.<br />
          These terms and conditions ("terms of use") apply to you right the moment you access and use ${data.companyName}: its services, products, and contents. This is a legal agreement between you and ${data.companyName}.<br />
          Travelers First name and Last name must match government-issued ID.<br />
          <strong>Fare Policy</strong><br />
          • ${data.companyName} accepts Debit Cards and Credit Cards<br />
          • All prices are in USD<br />
          • Ticket fares do not include baggage fees<br />
          <strong>Payment Policy</strong><br />
          • Ticket is not guaranteed until issued<br />
          • In case of card issues, we notify within 24 hrs<br />
          <strong>Credit Card Declines</strong><br />
          • You will be notified within 24-48 hours<br />
          • Booking is not guaranteed until payment success<br />
          <strong>Cancellation/Exchanges</strong><br />
          • Must be requested at least 24 hrs prior to departure<br />
          • Non-refundable tickets unless airline allows<br />
          • Subject to airline penalties and fare difference<br />
          • ${data.companyName} may charge refund/change fees<br />
        </div>

          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0;">
            <p style="color: #6b7280; margin-bottom: 25px; font-size: 16px; line-height: 1.5;">
              By clicking the button below, you confirm that you agree to the terms and authorize the payment.
            </p>
            <a href="https://myfaredeal.us/authorize-payment?token=YOUR_UNIQUE_TOKEN" 
               class="cta-button"
               style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); 
                      color: #ffffff; 
                      padding: 18px 40px; 
                      text-decoration: none; 
                      border-radius: 50px; 
                      font-weight: 700; 
                      font-size: 16px;
                      display: inline-block; 
                      text-transform: uppercase; 
                      letter-spacing: 1px;
                      box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
                      transition: all 0.3s ease;">
              🔒 AUTHORIZE PAYMENT
            </a>
            <p style="color: #9ca3af; margin-top: 15px; font-size: 12px; line-height: 1.4;">
              This authorization link is secure and will expire in 1 hour
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; line-height: 1.4;">
            Need help? Contact our support team
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.4;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px; line-height: 1.4;">
            © ${new Date().getFullYear()} ${data.companyName || 'Your Merchant'}. All rights reserved.
          </p>
        </div>

      </div>

    </body>
    </html>
  `;
};

module.exports = generateEmailTemplate;