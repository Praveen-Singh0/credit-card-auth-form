const nodemailer = require("nodemailer");
const generateEmailTemplate = require("../emailTemplate");
const crypto = require("crypto");

// In-memory store for tokens. In a real app, use a database.
const tokenStore = {};

const sendEmail = async (req, res) => {
  const data = req.body;
  console.log("Form data received in controller:", data);

  // Generate a unique token
  const token = crypto.randomBytes(20).toString("hex");
  tokenStore[token] = { data, timestamp: Date.now() }; // Store form data with token

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bookings@myfaredeal.com",
      pass: "fzfm gnop pvrm prgm",
    },
  });

  const mailOptions = {
    from: "bookings@myfaredeal.com",
    to: data.customerEmail,
    subject: "Credit Card Authorization Request",
    html: generateEmailTemplate(data).replace("YOUR_UNIQUE_TOKEN", token),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Authorization email sent to ${data.customerEmail} with token: ${token}`
    );
    res.status(200).send({ message: "Authorization email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send email" });
  }
};

const authorizePayment = async (req, res) => {
  const { token } = req.query;

  if (token && tokenStore[token]) {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "N/A";

    const { data, timestamp } = tokenStore[token];
    if (Date.now() - timestamp > 4600000) {
      delete tokenStore[token];
      return res.status(400).send("Authorization link has expired.");
    }

   const createAdminFlightSummaryEditor = (htmlContent) => {
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
        <div class="flight-editor-content" style="padding: 20px; max-height: 350px; overflow-y: auto; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
          ${styledContent}
        </div>
        
        <!-- Status Bar -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 6px 12px; font-size: 10px; color: #6b7280; text-align: right;">
          <span>📄 Flight Details • Admin View</span>
        </div>
      </div>
    `;
  };

    // === SEND EMAIL TO ADMIN ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bookings@myfaredeal.com",
        pass: "fzfm gnop pvrm prgm",
      },
    });

    // Build a detailed HTML email for the admin
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Authorization Confirmed</title>
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
          width: 6px;
        }
        .flight-editor-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .flight-editor-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
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
          .info-card {
            padding: 25px 20px !important;
          }
          .amount-display {
            font-size: 36px !important;
          }
          .flight-section {
            margin: 0 -10px !important;
          }
          .status-badges {
            flex-direction: column !important;
            gap: 12px !important;
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
          .info-card {
            padding: 20px 15px !important;
          }
          .amount-display {
            font-size: 28px !important;
          }
          .flight-section {
            margin: 0 -5px !important;
          }
        }
        
        /* Pulse animation for status indicator */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #10b981 0%, #059669 100%); min-height: 100vh;">
      
      <!-- Full Width Container -->
      <div style="width: 100%; max-width: none; background-color: #ffffff;">
        
        <!-- Success Hero Section -->
        <div class="hero-section" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 60px 40px; text-align: center; position: relative; overflow: hidden;">
          <!-- Animated background elements -->
          <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 40px 40px; opacity: 0.2;"></div>
          
          <div style="position: relative; z-index: 2; max-width: 800px; margin: 0 auto;">
            <div style="display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; padding: 8px 24px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.3);">
              <span style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">✅ Payment Confirmed</span>
            </div>
            
            <h1 class="hero-title" style="color: #ffffff; font-size: 42px; font-weight: 800; margin-bottom: 16px; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              🎉 Authorization Successful
            </h1>
            
            <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
              A customer has successfully authorized their payment. All booking details are provided below.
            </p>
            
            <!-- Success Status Badges -->
            <div class="status-badges" style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;">
              <div style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 12px 20px;">
                <div class="pulse" style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; margin-right: 12px;"></div>
                <span style="color: #ffffff; font-weight: 600; font-size: 14px;">Payment Authorized</span>
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 12px 20px;">
                <span style="color: #ffffff; font-weight: 600; font-size: 14px;">💰 USD $${data.amount}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Section -->
        <div class="content-section" style="padding: 50px 40px; background: #ffffff;">
          <div style="max-width: 1200px; margin: 0 auto;">
            
            <!-- Quick Summary Alert -->
            <div style="text-align: center; margin-bottom: 50px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 16px; padding: 24px 32px; border: 2px solid #22c55e;">
                <h2 style="color: #166534; font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                  New Authorization Received! 🚀
                </h2>
                <p style="color: #475569; font-size: 16px; margin: 0; line-height: 1.6;">
                  <strong>${data.cardholderName}</strong> has authorized payment for booking reference <strong>${data.bookingReference}</strong>
                </p>
              </div>
            </div>

            <!-- Information Grid -->
            <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px;">
              
              <!-- Customer & Booking Information -->
              <div class="info-card" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 20px; padding: 32px; border: 1px solid #3b82f6; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(59, 130, 246, 0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div style="background: #3b82f6; border-radius: 12px; padding: 12px; margin-right: 16px;">
                      <span style="color: #ffffff; font-size: 20px;">👤</span>
                    </div>
                    <h3 style="color: #1e40af; font-size: 22px; font-weight: 700; margin: 0;">Customer Details</h3>
                  </div>
                  
                  <div style="space-y: 16px;">
                    <div style="margin-bottom: 16px;">
                      <p style="color: #1d4ed8; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Booking Reference</p>
                      <p style="color: #1e3a8a; font-size: 18px; font-weight: 700; margin: 0; font-family: monospace;">${data.bookingReference}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                      <p style="color: #1d4ed8; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Customer Email</p>
                      <p style="color: #1e3a8a; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">${data.customerEmail}</p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                      <p style="color: #1d4ed8; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Passengers</p>
                      <p style="color: #1e3a8a; font-size: 16px; font-weight: 500; margin: 0; word-break: break-word;">
                        ${data.passengers && data.passengers.length ? data.passengers.join(", ") : "N/A"}
                      </p>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                      <p style="color: #1d4ed8; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Service Details</p>
                      <p style="color: #1e3a8a; font-size: 14px; font-weight: 500; margin: 0; word-break: break-word;">${data.serviceDetails}</p>
                    </div>
                    
                    <div>
                      <p style="color: #1d4ed8; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Contact Number</p>
                      <p style="color: #1e3a8a; font-size: 16px; font-weight: 500; margin: 0;">${data.contactNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="info-card" style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 20px; padding: 32px; border: 1px solid #f59e0b; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(245, 158, 11, 0.1); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div style="background: #f59e0b; border-radius: 12px; padding: 12px; margin-right: 16px;">
                      <span style="color: #ffffff; font-size: 20px;">💳</span>
                    </div>
                    <h3 style="color: #92400e; font-size: 22px; font-weight: 700; margin: 0;">Payment Details</h3>
                  </div>
                  
                  <div style="background: #ffffff; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                      <span style="color: #374151; font-weight: 600;">${data.cardType}</span>
                      <span style="color: #6b7280; font-size: 14px; font-family: monospace;">•••• ${data.cardNumber.slice(-4)}</span>
                    </div>
                    <p style="color: #1f2937; font-size: 18px; font-weight: 700; margin-bottom: 8px;">${data.cardholderName}</p>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Expires: ${data.expiryDate}</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 0; word-break: break-word;">Billing: ${data.billingEmail}</p>
                  </div>
                  
                  <div style="text-align: center;">
                    <p style="color: #92400e; font-weight: 600; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Authorized Amount</p>
                    <p class="amount-display" style="color: #b45309; font-size: 42px; font-weight: 900; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">$${data.amount}</p>
                    <p style="color: #92400e; font-size: 16px; margin: 4px 0 0 0;">USD</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flight Details Section (Unchanged) -->
            <div class="flight-section" style="margin-bottom: 50px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h2 style="color: #1f2937; font-size: 28px; font-weight: 800; margin-bottom: 8px;">✈️ Flight Information</h2>
                <p style="color: #6b7280; font-size: 16px; margin: 0;">Complete flight itinerary details</p>
              </div>
              
              <div style="max-width: 900px; margin: 0 auto;">
                ${createAdminFlightSummaryEditor(data.flightSummary)}
              </div>
            </div>

            <!-- Billing & Additional Information -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 20px; padding: 40px; margin-bottom: 50px; border: 1px solid #0ea5e9;">
              <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                <h3 style="color: #0c4a6e; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="margin-right: 12px;">🏠</span> Billing Information
                </h3>
                
                <div style="background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <div style="margin-bottom: 20px;">
                    <p style="color: #0369a1; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Billing Address</p>
                    <p style="color: #1f2937; font-size: 16px; font-weight: 500; margin: 0; line-height: 1.6; word-break: break-word;">${data.address}</p>
                  </div>
                  
                  <div>
                    <p style="color: #0369a1; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Merchant Company</p>
                    <p style="color: #1f2937; font-size: 18px; font-weight: 700; margin: 0;">${data.companyName}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Authorization Agreement -->
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 20px; padding: 40px; margin-bottom: 50px; border: 1px solid #f87171;">
              <div style="max-width: 800px; margin: 0 auto;">
                <h3 style="color: #dc2626; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="margin-right: 12px;">📝</span> Customer Authorization Agreement
                </h3>
                
                <div style="background: #ffffff; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <p style="color: #374151; font-size: 16px; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
                    As per our telephonic conversation and as agreed, I, <strong style="color: #dc2626;">${data.cardholderName}</strong>, 
                    authorize <strong style="color: #dc2626;">${data.companyName || "the merchant"}</strong> to charge 
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
                  <p style="color: #6b7280; font-weight: 600; margin-bottom: 12px;">Customer Digital Signature:</p>
                  <p style="color: #1f2937; font-size: 24px; font-weight: 700; font-family: cursive; margin: 0;">${data.cardholderName}</p>
                </div>
              </div>
            </div>

            <!-- System Information -->
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 20px; padding: 40px; margin-bottom: 50px; border: 1px solid #9ca3af;">
              <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                <h3 style="color: #374151; font-size: 24px; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="margin-right: 12px;">🔍</span> System Information
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                  <div style="background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <p style="color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Authorization Time</p>
                    <p style="color: #1f2937; font-size: 16px; font-weight: 700; margin: 0;">
                      ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </p>
                  </div>
                  
                  <div style="background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <p style="color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">IP Address</p>
                    <p style="color: #1f2937; font-size: 16px; font-weight: 700; margin: 0; font-family: monospace; word-break: break-all;">
                      ${ipAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px 40px 30px 40px; color: #ffffff;">
          <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
            
            <!-- Admin Dashboard Info -->
            <div style="margin-bottom: 32px;">
              <h4 style="color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                Admin Notification System
              </h4>
              <p style="color: #cbd5e1; font-size: 16px; margin: 0; line-height: 1.6;">
                Automated payment authorization notification system
              </p>
            </div>
            
            <!-- Support Info -->
            <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 32px; backdrop-filter: blur(10px);">
              <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin-bottom: 12px;">
                📊 Dashboard & System Management
              </p>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0;">
                This notification was automatically generated by your payment system. 
                Review all transactions in your admin dashboard.
              </p>
            </div>
            
            <!-- Legal -->
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">
                This is an automated admin notification. Do not reply to this email.
              </p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${data.companyName || 'Your Company'} Admin System. All rights reserved. | 
                <a href="#" style="color: #cbd5e1; text-decoration: none;">System Logs</a> | 
                <a href="#" style="color: #cbd5e1; text-decoration: none;">Admin Dashboard</a>
              </p>
            </div>
            
          </div>
        </div>

      </div>

    </body>
    </html>`;

    const adminMailOptions = {
      from: "bookings@myfaredeal.com",
      // to: "arun@farebulk.com, sam@farebulk.com, sandeepnegi2016@gmail.com",
      to: "parnbartwal@gmail.com",
      subject: "Payment Authorized by CustomerF",
      html: adminHtml,
    };

    try {
      await transporter.sendMail(adminMailOptions);
      console.log("Admin notified of authorized payment.");
    } catch (err) {
      console.error("Failed to send admin notification:", err);
    }

    delete tokenStore[token];
    res.redirect(
      `https://myfaredeal.us/thank-you?name=${data.cardholderName}&merchant=${data.companyName}`
    );
  } else {
    res.status(400).send("Invalid or expired authorization link.");
  }
};

module.exports = {
  sendEmail,
  authorizePayment,
};
