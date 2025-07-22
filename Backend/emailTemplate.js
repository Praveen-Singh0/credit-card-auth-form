const generateEmailTemplate = (data) => {
  const passengersList = data.passengers && data.passengers.length 
    ? data.passengers.map(p => `<li style="margin: 5px 0; color: #374151;">${p}</li>`).join('') 
    : '<li style="margin: 5px 0; color: #6b7280;">No passengers listed</li>';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Credit Card Authorization Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; line-height: 1.6;">
      
      <div style="max-width: 650px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%);"></div>
          <div style="position: relative; z-index: 1;">
            <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
              🔐 Credit Card Authorization
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; font-weight: 400;">
              Please review and authorize your payment details below
            </p>
          </div>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Welcome Message -->
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 500;">
              Dear ${data.cardholderName || 'Valued Customer'},
            </p>
            <p style="margin: 10px 0 0 0; color: #374151; font-size: 14px;">
              We need your authorization to process the payment for your booking. Please review the details below and click the authorization button to proceed.
            </p>
          </div>

          <!-- Traveler Information Section -->
          <div style="margin-bottom: 35px;">
            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">✈️</span> Booking Information
            </h2>
            <div style="background-color: #f9fafb; padding: 25px; border-radius: 10px; border: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: 600; width: 35%; vertical-align: top;">Booking Reference:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-size: 16px;">${data.bookingReference}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Customer Email:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.customerEmail}</td>
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
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.contactNo || 'Not provided'}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Booking Details Section -->
          <div style="margin-bottom: 35px;">
            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">📋</span> Trip Details
            </h2>
            <div style="background-color: #fefce8; padding: 25px; border-radius: 10px; border: 1px solid #fde047; border-left: 4px solid #eab308;">
              <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7;">
                ${data.bookingDetails}
              </p>
            </div>
          </div>

          <!-- Payment Information Section -->
          <div style="margin-bottom: 35px;">
            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">💳</span> Payment Details
            </h2>
            <div style="background-color: #f0fdf4; padding: 25px; border-radius: 10px; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; width: 35%;">Cardholder Name:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-size: 16px;">${data.cardholderName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600;">Card Type:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.cardType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600;">Card Number:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-family: monospace;">**** **** **** ${data.cardNumber.slice(-4)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600;">Expiration Date:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.expiryDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600;">Billing Email:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${data.billingEmail}</td>
                </tr>
                <tr style="border-top: 2px solid #dcfce7;">
                  <td style="padding: 15px 0 10px 0; color: #166534; font-weight: 700; font-size: 18px;">Total Amount:</td>
                  <td style="padding: 15px 0 10px 0; color: #1f2937; font-weight: 700; font-size: 20px;">USD $${data.amount}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Authorization Agreement Section -->
          <div style="margin-bottom: 35px;">
            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
              <span style="margin-right: 10px;">📝</span> Authorization Agreement
            </h2>
            <div style="background-color: #fef2f2; padding: 25px; border-radius: 10px; border: 1px solid #fecaca; border-left: 4px solid #ef4444;">
              <p style="margin: 0 0 15px 0; color: #374151; font-size: 15px; line-height: 1.8; text-align: justify;">
                As per our telephonic conversation and as agreed, I, <strong>${data.cardholderName}</strong>, 
                authorize <strong>${data.companyName || 'the company'}</strong> to charge <strong>USD $${data.amount}</strong> 
                to the above credit card for <strong>${data.serviceDetails}</strong>.
              </p>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 3px solid #ef4444; margin-top: 15px;">
                <p style="margin: 0; color: #dc2626; font-size: 14px; font-weight: 600;">
                  ⚠️ Important Terms & Conditions:
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
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: center; border: 2px dashed #cbd5e1;">
            <p style="margin: 0 0 10px 0; color: #475569; font-weight: 600; font-size: 16px;">
              📝 Digital Signature
            </p>
            <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: 500; font-style: italic; background-color: #ffffff; padding: 10px; border-radius: 6px; display: inline-block; min-width: 200px;">
              "${data.customerSignature}"
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0;">
            <p style="color: #6b7280; margin-bottom: 25px; font-size: 16px;">
              By clicking the button below, you confirm that you agree to the terms and authorize the payment.
            </p>
            <a href="https://easyflightnow.com/authorize-payment?token=YOUR_UNIQUE_TOKEN" 
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
            <p style="color: #9ca3af; margin-top: 15px; font-size: 12px;">
              This authorization link is secure and will expire in 1 hour
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
            Need help? Contact our support team
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
            © ${new Date().getFullYear()} ${data.companyName || 'Your Company'}. All rights reserved.
          </p>
        </div>

      </div>

    </body>
    </html>
  `;
};

module.exports = generateEmailTemplate;