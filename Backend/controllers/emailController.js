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

    // Enhanced flight summary editor for admin email
    const createAdminFlightSummaryEditor = (htmlContent) => {
      if (!htmlContent || htmlContent.trim() === '') {
        return `
          <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; font-family: 'Courier New', Monaco, monospace; overflow: hidden; margin: 15px 0;">
            <!-- Editor Header -->
            <div style="background-color: #f8fafc; border-bottom: 1px solid #e5e7eb; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">✈️ Flight Summary</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #ef4444;"></div>
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #f59e0b;"></div>
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #10b981;"></div>
              </div>
            </div>
            <!-- Editor Content -->
            <div style="padding: 30px 20px; background-color: #ffffff; color: #6b7280; font-style: italic; text-align: center; font-size: 14px;">
              <div style="font-size: 24px; margin-bottom: 12px;">📄</div>
              <p style="margin: 0; color: #9ca3af;">No flight details provided</p>
            </div>
          </div>
        `;
      }

       // Remove script tags for security
      const cleanHtml = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      // Enhanced styling for admin email
      const styledContent = cleanHtml
        .replace(/<p>/g, '<p style="margin: 0 0 10px 0; color: #374151; line-height: 1.6; font-size: 13px;">')
        .replace(/<h1>/g, '<h1 style="color: #1f2937; margin: 20px 0 10px 0; font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px;">')
        .replace(/<h2>/g, '<h2 style="color: #1f2937; margin: 16px 0 8px 0; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f3f4f6; padding-bottom: 4px;">')
        .replace(/<h3>/g, '<h3 style="color: #1f2937; margin: 14px 0 6px 0; font-size: 14px; font-weight: 600;">')
        .replace(/<ul>/g, '<ul style="margin: 10px 0; padding-left: 20px; color: #374151;">')
        .replace(/<ol>/g, '<ol style="margin: 10px 0; padding-left: 20px; color: #374151;">')
        .replace(/<li>/g, '<li style="margin: 4px 0; color: #374151; line-height: 1.5; font-size: 13px;">')
        .replace(/<strong>/g, '<strong style="font-weight: 700; color: #1f2937;">')
        .replace(/<em>/g, '<em style="font-style: italic; color: #4b5563;">')
        .replace(/<a /g, '<a style="color: #3b82f6; text-decoration: underline;" ')
        .replace(/<img /g, '<img style="max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; box-shadow: 0 1px 4px rgba(0,0,0,0.1);" ')
        .replace(/<table>/g, '<table style="width: 100%; border-collapse: collapse; margin: 12px 0; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden; font-size: 12px;">')
        .replace(/<td>/g, '<td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #374151; font-size: 12px; line-height: 1.4;">')
        .replace(/<th>/g, '<th style="padding: 10px; background-color: #f8fafc; color: #1f2937; font-weight: 600; text-align: left; font-size: 11px; border-bottom: 1px solid #e5e7eb;">')
        .replace(/<div>/g, '<div style="margin: 6px 0;">')
        .replace(/<br>/g, '<br/>');

      return `
        <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; font-family: 'Courier New', Monaco, monospace; overflow: hidden; margin: 15px 0; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
          <!-- Editor Header -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 1px solid #e5e7eb; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="color: #475569; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">✈️ Flight Summary</span>
              <span style="color: #94a3b8; font-size: 9px;">• Read Only</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #ef4444; opacity: 0.7;"></div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #f59e0b; opacity: 0.7;"></div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #10b981; opacity: 0.7;"></div>
            </div>
          </div>
          
          <!-- Compact Toolbar -->
          <div style="background-color: #fafafa; border-bottom: 1px solid #e5e7eb; padding: 6px 10px; font-size: 9px;">
            <div style="display: flex; gap: 6px; align-items: center; opacity: 0.6;">
              <span style="padding: 3px 6px; background-color: #e5e7eb; border-radius: 2px; color: #6b7280; font-weight: 600; font-size: 9px;">B</span>
              <span style="padding: 3px 6px; background-color: #e5e7eb; border-radius: 2px; color: #6b7280; font-style: italic; font-size: 9px;">I</span>
              <span style="padding: 3px 6px; background-color: #e5e7eb; border-radius: 2px; color: #6b7280; text-decoration: underline; font-size: 9px;">U</span>
              <span style="width: 1px; height: 12px; background-color: #d1d5db;"></span>
              <span style="padding: 3px 6px; background-color: #e5e7eb; border-radius: 2px; color: #6b7280; font-size: 8px;">• List</span>
              <span style="padding: 3px 6px; background-color: #e5e7eb; border-radius: 2px; color: #6b7280; font-size: 8px;">📷</span>
            </div>
          </div>
          
          <!-- Scrollable Content -->
          <div style="padding: 16px; max-height: 280px; overflow-y: auto; background-color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.5; scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
            ${styledContent}
          </div>
          
          <!-- Status Bar -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 4px 10px; font-size: 9px; color: #6b7280; text-align: right;">
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
    <title>Payment Authorization Notification</title>
    <style>
        /* Scrollbar Styling for Flight Summary */
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
        
        /* Mobile-first responsive styles */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            .header {
                padding: 20px 15px !important;
            }
            .header h1 {
                font-size: 20px !important;
                line-height: 1.3 !important;
            }
            .content {
                padding: 20px 15px !important;
            }
            .section-title {
                font-size: 16px !important;
            }
            .info-box {
                padding: 15px !important;
                margin-bottom: 20px !important;
            }
            .info-table {
                font-size: 14px !important;
            }
            .info-table td {
                padding: 6px 0 !important;
                display: block !important;
                width: 100% !important;
            }
            .info-table td:first-child {
                font-weight: 700 !important;
                margin-bottom: 3px !important;
            }
            .amount {
                font-size: 16px !important;
            }
            .authorization-text {
                font-size: 14px !important;
                line-height: 1.6 !important;
            }
            .footer {
                padding: 15px !important;
            }
            .footer p {
                font-size: 11px !important;
            }
            .flight-editor {
                margin: 0 -15px !important;
            }
            .flight-editor-content {
                max-height: 200px !important;
                padding: 12px !important;
            }
            .editor-header {
                padding: 8px 12px !important;
            }
            .editor-toolbar {
                padding: 4px 12px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <div class="container" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; line-height: 1.2;">
                🎉 Payment Authorization Confirmed
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; line-height: 1.4;">
                A customer has successfully authorized their payment
            </p>
        </div>

        <!-- Main Content -->
        <div class="content" style="padding: 30px 20px;">
            
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 30px;">
                <span style="background-color: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                    ✅ AUTHORIZED
                </span>
            </div>

            <!-- Customer Information Section -->
            <div style="margin-bottom: 30px;">
                <h2 class="section-title" style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    📋 Booking Details
                </h2>
                <div class="info-box" style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <table class="info-table" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 40%; vertical-align: top;">Booking Reference:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.bookingReference}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Customer Email:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.customerEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Passenger(s):</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${
                              data.passengers && data.passengers.length
                                ? data.passengers.join(", ")
                                : "N/A"
                            }</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Service Details:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.serviceDetails}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Contact Number:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.contactNo}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Flight Details Section with Scrollable Editor -->
            <div style="margin-bottom: 30px;">
                <h2 class="section-title" style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    ✈️ Flight Details
                </h2>
                <div class="flight-editor">
                    ${createAdminFlightSummaryEditor(data.flightSummary)}
                </div>
            </div>

            <!-- Payment Information Section -->
            <div style="margin-bottom: 30px;">
                <h2 class="section-title" style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    💳 Payment Information
                </h2>
                <div class="info-box" style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <table class="info-table" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; width: 40%; vertical-align: top;">Amount:</td>
                            <td class="amount" style="padding: 8px 0; color: #1f2937; font-weight: 700; font-size: 18px;">USD ${data.amount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; vertical-align: top;">Card Type:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.cardType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; vertical-align: top;">Cardholder:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.cardholderName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; vertical-align: top;">Card Number:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">**** **** **** ${data.cardNumber.slice(-4)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; vertical-align: top;">Expiry Date:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.expiryDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; vertical-align: top;">Billing Email:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${data.billingEmail}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Billing Address Section -->
            <div style="margin-bottom: 30px;">
                <h2 class="section-title" style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    🏠 Billing Information
                </h2>
                <div class="info-box" style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                    <p style="margin: 0; color: #1f2937; line-height: 1.6; word-break: break-word;"><strong>Address:</strong> ${data.address}</p>
                    <p style="margin: 10px 0 0 0; color: #1f2937; line-height: 1.6; word-break: break-word;"><strong>Merchant:</strong> ${data.companyName}</p>
                </div>
            </div>

            <!-- Authorization Agreement Section -->
          <div style="margin-bottom: 35px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                📝 Authorization Agreement
            </h2>
            <div class="info-box" style="background-color: #fef2f2; padding: 25px; border-radius: 10px; border: 1px solid #fecaca; border-left: 4px solid #ef4444;">
              <p class="authorization-text" style="margin: 0 0 15px 0; color: #374151; font-size: 15px; line-height: 1.8; text-align: justify; word-break: break-word;">
                As per our telephonic conversation and as agreed, I, <strong>${data.cardholderName}</strong>, 
                authorize <strong>${data.companyName || "the merchant"}</strong> to charge <strong>USD ${data.amount}</strong> 
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
              📝  Customer Signature
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

            <!-- Timestamp -->
            <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
             <strong>Authorized At:</strong> ${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            })}
            </p>

                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.4; word-break: break-all;">
                    <strong>IP Address:</strong> ${ipAddress}
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px; line-height: 1.4;">
                This is an automated notification from your payment system.
            </p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px; line-height: 1.4;">
                © ${new Date().getFullYear()} ${data.companyName || "Your Merchant"}. All rights reserved.
            </p>
        </div>

    </div>
</body>
</html>
    `;

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
