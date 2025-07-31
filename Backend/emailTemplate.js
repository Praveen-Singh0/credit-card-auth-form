const generateEmailTemplate = (data) => {
  const passengersList = data.passengers && data.passengers.length
    ? data.passengers.map(p => `<li style="margin: 8px 0; color: #475569; font-weight: 500;">${p}</li>`).join('')
    : '<li style="margin: 8px 0; color: #94a3b8; font-style: italic;">No passengers listed</li>';

  // Keep the original Flight Summary Editor (unchanged)
  const createFlightSummaryEditor = (htmlContent) => {
    if (!htmlContent || htmlContent.trim() === '') {
      return `
        <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; font-family: 'Courier New', Monaco, monospace; overflow: hidden;">
          <!-- Editor Header -->
          <div style="background-color: #f8fafc; border-bottom: 1px solid #e5e7eb; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Flight Summary</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #ef4444;"></div>
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #f59e0b;"></div>
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #10b981;"></div>
            </div>
          </div>
          <!-- Editor Content -->
          <div style="padding: 20px; max-height: 300px; overflow-y: auto; background-color: #ffffff; color: #6b7280; font-style: italic; text-align: center; font-size: 14px; line-height: 1.6;">
            <div style="padding: 40px 20px;">
              <div style="font-size: 32px; margin-bottom: 16px;">📄</div>
              <p style="margin: 0; color: #9ca3af;">No flight details provided</p>
            </div>
          </div>
        </div>
      `;
    }

    // Remove script tags for security
    const cleanHtml = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Enhanced styling for email compatibility
    const styledContent = cleanHtml
      .replace(/<p>/g, '<p style="margin: 0 0 12px 0; color: #374151; line-height: 1.7; font-size: 14px;">')
      .replace(/<h1>/g, '<h1 style="color: #1f2937; margin: 24px 0 12px 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">')
      .replace(/<h2>/g, '<h2 style="color: #1f2937; margin: 20px 0 10px 0; font-size: 18px; font-weight: 600; border-bottom: 1px solid #f3f4f6; padding-bottom: 6px;">')
      .replace(/<h3>/g, '<h3 style="color: #1f2937; margin: 16px 0 8px 0; font-size: 16px; font-weight: 600;">')
      .replace(/<ul>/g, '<ul style="margin: 12px 0; padding-left: 24px; color: #374151;">')
      .replace(/<ol>/g, '<ol style="margin: 12px 0; padding-left: 24px; color: #374151;">')
      .replace(/<li>/g, '<li style="margin: 6px 0; color: #374151; line-height: 1.6;">')
      .replace(/<strong>/g, '<strong style="font-weight: 700; color: #1f2937;">')
      .replace(/<em>/g, '<em style="font-style: italic; color: #4b5563;">')
      .replace(/<a /g, '<a style="color: #3b82f6; text-decoration: underline; hover: color: #1d4ed8;" ')
      .replace(/<img /g, '<img style="max-width: 100%; height: auto; border-radius: 6px; margin: 12px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" ')
      .replace(/<table>/g, '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">')
      .replace(/<td>/g, '<td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 13px; line-height: 1.5;">')
      .replace(/<th>/g, '<th style="padding: 12px; background-color: #f8fafc; color: #1f2937; font-weight: 600; text-align: left; font-size: 13px; border-bottom: 2px solid #e5e7eb;">')
      .replace(/<div>/g, '<div style="margin: 8px 0;">')
      .replace(/<br>/g, '<br/>');

    return `
      <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; font-family: 'Courier New', Monaco, monospace; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Editor Content with Scroll -->
        <div style="padding: 20px; max-height: 350px; overflow-y: auto; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
          ${styledContent}
        </div>
        
        <!-- Status Bar -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 6px 12px; font-size: 10px; color: #6b7280; text-align: right;">
          <span>📄 Flight Details • Read Only Mode</span>
        </div>
      </div>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Authorization Request</title>
      <style>
        /* Reset styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        /* Scrollbar styling for flight editor */
        .flight-editor-content::-webkit-scrollbar {
          width: 8px;
        }
        .flight-editor-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .flight-editor-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .flight-editor-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Mobile responsive styles */
        @media only screen and (max-width: 768px) {
          .hero-section {
            padding: 40px 20px !important;
          }
          .hero-title {
            font-size: 28px !important;
            line-height: 1.2 !important;
          }
          .content-section {
            padding: 30px 20px !important;
          }
          .info-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .payment-card {
            padding: 25px 20px !important;
          }
          .amount-display {
            font-size: 36px !important;
          }
          .cta-button {
            padding: 16px 32px !important;
            font-size: 16px !important;
          }
          .flight-section {
            margin: 0 -10px !important;
          }
        }
        
        @media only screen and (max-width: 480px) {
          .hero-section {
            padding: 30px 15px !important;
          }
          .hero-title {
            font-size: 24px !important;
          }
          .content-section {
            padding: 25px 15px !important;
          }
          .payment-card {
            padding: 20px 15px !important;
          }
          .amount-display {
            font-size: 28px !important;
          }
          .flight-section {
            margin: 0 -5px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
      
      <!-- Full Width Container -->
      <div style="width: 100%; max-width: none; background-color: #ffffff;">
        
        <!-- Hero Section -->
        <div class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; text-align: center; position: relative; overflow: hidden;">
          <!-- Animated background elements -->
          <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px; animation: float 20s infinite linear; opacity: 0.3;"></div>
          
          <div style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;">
            <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 8px 24px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.3);">
              <span style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">🔒 Secure Payment</span>
            </div>
            
            <h1 class="hero-title" style="color: #ffffff; font-size: 42px; font-weight: 800; margin-bottom: 16px; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Payment Authorization Required
            </h1>
            
            <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
              Please review your booking details and authorize the payment to complete your travel reservation
            </p>
            
            <!-- Status indicator -->
            <div style="display: inline-flex; align-items: center; background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 50px; padding: 12px 24px;">
              <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 12px; animation: pulse 2s infinite;"></div>
              <span style="color: #ffffff; font-weight: 600; font-size: 14px;">Awaiting Authorization</span>
            </div>
          </div>
        </div>

        <!-- Main Content Section -->
        <div class="content-section" style="padding: 50px 40px; background: #ffffff;">
          <div style="max-width: 1200px; margin: 0 auto;">
            
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 50px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 16px; padding: 24px 32px; border-left: 4px solid #0ea5e9;">
                <h2 style="color: #0c4a6e; font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                  Hello ${data.cardholderName || 'Valued Customer'}! 👋
                </h2>
                <p style="color: #475569; font-size: 16px; margin: 0; line-height: 1.6;">
                  We're ready to process your booking. Please review the details below and click authorize to proceed.
                </p>
              </div>
            </div>

            <!-- Information Grid -->
            <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px;">
              
              <!-- Booking Information -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 20px; padding: 32px; border: 1px solid #f59e0b; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(245, 158, 11, 0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div style="background: #f59e0b; border-radius: 12px; padding: 12px; margin-right: 16px;">
                      <span style="color: #ffffff; font-size: 20px;">📋</span>
                    </div>
                    <h3 style="color: #92400e; font-size: 22px; font-weight: 700; margin: 0;">Booking Details</h3>
                  </div>
                  
                  <div style="space-y: 16px;">
                    <div style="margin-bottom: 16px;">
                      <p style="color: #b45309; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Reference</p>
                      <p style="color: #451a03; font-size: 18px; font-weight: 700; margin: 0; font-family: monospace;">${data.bookingReference}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                      <p style="color: #b45309; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</p>
                      <p style="color: #451a03; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${data.customerEmail}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                      <p style="color: #b45309; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Passengers</p>
                      <ul style="list-style: none; padding: 0; margin: 0;">
                        ${passengersList}
                      </ul>
                    </div>
                    
                    <div>
                      <p style="color: #b45309; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Contact</p>
                      <p style="color: #451a03; font-size: 16px; font-weight: 500; margin: 0;">${data.contactNo || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="payment-card" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 20px; padding: 32px; border: 1px solid #22c55e; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(34, 197, 94, 0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div style="background: #22c55e; border-radius: 12px; padding: 12px; margin-right: 16px;">
                      <span style="color: #ffffff; font-size: 20px;">💳</span>
                    </div>
                    <h3 style="color: #166534; font-size: 22px; font-weight: 700; margin: 0;">Payment Method</h3>
                  </div>
                  
                  <div style="background: #ffffff; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                      <span style="color: #374151; font-weight: 600;">${data.cardType}</span>
                      <span style="color: #6b7280; font-size: 14px;">•••• ${data.cardNumber.slice(-4)}</span>
                    </div>
                    <p style="color: #1f2937; font-size: 18px; font-weight: 700; margin-bottom: 8px;">${data.cardholderName}</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">Expires: ${data.expiryDate}</p>
                  </div>
                  
                  <div style="text-align: center;">
                    <p style="color: #166534; font-weight: 600; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Total Amount</p>
                    <p class="amount-display" style="color: #15803d; font-size: 42px; font-weight: 900; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">$${data.amount}</p>
                    <p style="color: #166534; font-size: 16px; margin: 4px 0 0 0;">USD</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flight Details Section (Unchanged) -->
            <div class="flight-section" style="margin-bottom: 50px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h2 style="color: #1f2937; font-size: 28px; font-weight: 800; margin-bottom: 8px;">✈️ Flight Information</h2>
                <p style="color: #6b7280; font-size: 16px; margin: 0;">Review your complete flight itinerary below</p>
              </div>
              
              <div style="max-width: 900px; margin: 0 auto;">
                ${createFlightSummaryEditor(data.flightSummary)}
              </div>
            </div>

            <!-- Authorization Agreement -->
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 20px; padding: 40px; margin-bottom: 50px; border: 1px solid #f87171; text-align: center;">
              <div style="max-width: 700px; margin: 0 auto;">
                <h3 style="color: #dc2626; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="margin-right: 12px;">📝</span> Authorization Agreement
                </h3>
                
                <div style="background: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 24px; text-align: left; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
                    I, <strong style="color: #dc2626;">${data.cardholderName}</strong>, hereby authorize 
                    <strong style="color: #dc2626;">${data.companyName || 'the merchant'}</strong> to charge 
                    <strong style="color: #dc2626;">USD $${data.amount}</strong> to my credit card ending in 
                    <strong style="color: #dc2626;">${data.cardNumber.slice(-4)}</strong> for 
                    <strong style="color: #dc2626;">${data.serviceDetails}</strong>.
                  </p>
                  
                  <div style="background: #f9fafb; border-left: 4px solid #dc2626; padding: 20px; border-radius: 0 8px 8px 0;">
                    <p style="color: #dc2626; font-weight: 700; margin-bottom: 12px; font-size: 14px;">Important Terms:</p>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;"><strong>Non-Refundable/Non-Transferable</strong> tickets</li>
                      <li style="margin-bottom: 8px;">Name changes <strong>not permitted</strong></li>
                      <li style="margin-bottom: 8px;">Changes subject to <strong>penalties + fare differences</strong></li>
                    </ul>
                  </div>
                </div>
                
                <!-- Digital Signature -->
                <div style="background: #ffffff; border: 2px dashed #d1d5db; border-radius: 12px; padding: 24px; text-align: center;">
                  <p style="color: #6b7280; font-weight: 600; margin-bottom: 12px;">Digital Signature:</p>
                  <p style="color: #1f2937; font-size: 24px; font-weight: 700; font-family: cursive; margin: 0;">${data.cardholderName}</p>
                </div>
              </div>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 50px;">
              <div style="max-width: 600px; margin: 0 auto 32px auto;">
                <p style="color: #475569; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
                  Ready to proceed? Click the button below to securely authorize your payment and complete your booking.
                </p>
              </div>
              
              <a href="https://myfaredeal.us/authorize-payment?token=YOUR_UNIQUE_TOKEN" 
                 class="cta-button"
                 style="display: inline-block; 
                        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                        color: #ffffff; 
                        padding: 20px 48px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-weight: 700; 
                        font-size: 18px;
                        text-transform: uppercase; 
                        letter-spacing: 1px;
                        box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
                        transition: all 0.3s ease;
                        border: none;
                        cursor: pointer;">
                🔒 AUTHORIZE PAYMENT NOW
              </a>
              
              <div style="margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; color: #22c55e; font-size: 14px; font-weight: 600;">
                  <span style="margin-right: 8px;">🔒</span> SSL Secured
                </div>
                <div style="display: flex; align-items: center; color: #22c55e; font-size: 14px; font-weight: 600;">
                  <span style="margin-right: 8px;">⚡</span> Instant Processing
                </div>
                <div style="display: flex; align-items: center; color: #22c55e; font-size: 14px; font-weight: 600;">
                  <span style="margin-right: 8px;">🛡️</span> Bank Grade Security
                </div>
              </div>
              
              <p style="color: #94a3b8; margin-top: 20px; font-size: 14px;">
                This secure authorization link expires in <strong>60 minutes</strong>
              </p>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px 40px 30px 40px; color: #ffffff;">
          <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
            
            <!-- Company Info -->
            <div style="margin-bottom: 32px;">
              <h4 style="color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                ${data.companyName || 'Your Travel Partner'}
              </h4>
              <p style="color: #cbd5e1; font-size: 16px; margin: 0; line-height: 1.6;">
                Your trusted partner for seamless travel experiences worldwide
              </p>
            </div>
            
            <!-- Support Info -->
            <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px; backdrop-filter: blur(10px);">
              <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
                📞 Need Help? Contact Our 24/7 Support Team
              </p>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0;">
                Call us at <strong>+1-844-480-0252</strong> or email support@${data.companyName ? data.companyName.toLowerCase().replace(/\s+/g, '') : 'company'}.com
              </p>
            </div>
            
            <!-- Legal -->
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${data.companyName || 'Your Company'}. All rights reserved. | 
                <a href="#" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a>
              </p>
            </div>
            
          </div>
        </div>

      </div>

    </body>
    </html>
  `;
};

module.exports = generateEmailTemplate;