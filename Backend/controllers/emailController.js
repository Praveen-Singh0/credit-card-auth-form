
const nodemailer = require('nodemailer');
const generateEmailTemplate = require('../emailTemplate');
const crypto = require('crypto');

// In-memory store for tokens. In a real app, use a database.
const tokenStore = {};

const sendEmail = async (req, res) => {
    const data = req.body;
    console.log('Form data received in controller:', data);

    // Generate a unique token
    const token = crypto.randomBytes(20).toString('hex');
    tokenStore[token] = { data, timestamp: Date.now() }; // Store form data with token

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bookings@myfaredeal.com',
            pass: 'fzfm gnop pvrm prgm'
        }
    });

    const mailOptions = {
        from: 'bookings@myfaredeal.com',
        to: data.customerEmail,
        subject: 'Credit Card Authorization Request',
        html: generateEmailTemplate(data).replace('YOUR_UNIQUE_TOKEN', token)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Authorization email sent to ${data.customerEmail} with token: ${token}`);
        res.status(200).send({ message: 'Authorization email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send email' });
    }
};

const authorizePayment = async (req, res) => {
    const { token } = req.query;

    if (token && tokenStore[token]) {

        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'N/A';

        const { data, timestamp } = tokenStore[token];
        if (Date.now() - timestamp > 4600000) {
            delete tokenStore[token];
            return res.status(400).send('Authorization link has expired.');
        }

        // === SEND EMAIL TO ADMIN ===
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bookings@myfaredeal.com',
                pass: 'fzfm gnop pvrm prgm'
            }
        });

        // Build a detailed HTML email for the admin
        const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Authorization Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                🎉 Payment Authorization Confirmed
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">
                A customer has successfully authorized their payment
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
            
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 30px;">
                <span style="background-color: #10b981; color: white; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    ✅ AUTHORIZED
                </span>
            </div>

            <!-- Customer Information Section -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    📋 Booking Details
                </h2>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 40%;">Booking Reference:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.bookingReference}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Customer Email:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.customerEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Passenger(s):</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.passengers && data.passengers.length ? data.passengers.join(', ') : 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Service Details:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.serviceDetails}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Contact Number:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.contactNo}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Payment Information Section -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    💳 Payment Information
                </h2>
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600; width: 40%;">Amount:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 700; font-size: 18px;">USD $${data.amount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600;">Card Type:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.cardType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600;">Cardholder:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.cardholderName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600;">Card Number:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">**** **** **** ${data.cardNumber.slice(-4)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600;">Expiry Date:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.expiryDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #92400e; font-weight: 600;">Billing Email:</td>
                            <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${data.billingEmail}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Billing Address Section -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    🏠 Billing Information
                </h2>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                    <p style="margin: 0; color: #1f2937; line-height: 1.6;"><strong>Address:</strong> ${data.address}</p>
                    <p style="margin: 10px 0 0 0; color: #1f2937; line-height: 1.6;"><strong>Company:</strong> ${data.companyName}</p>
                </div>
            </div>

            <!-- Authorization Statement -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #1f2937; font-size: 18px; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    📝 Authorization Statement
                </h2>
                <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="color: #374151; line-height: 1.7; margin: 0; font-style: italic;">
                        "As per our telephonic conversation and as agreed I, <strong>${data.cardholderName}</strong>, 
                        authorize <strong>${data.companyName}</strong> to charge my above card for 
                        <strong>USD $${data.amount}</strong> as per given details for <strong>${data.serviceDetails}</strong>. 
                        I understand that this charge is non-refundable. I also understand that any changes 
                        or cancellation may incur penalty plus difference in fare."
                    </p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #fecaca;">
                        <p style="margin: 0; color: #374151; font-size: 14px;">
                            <strong>Customer Signature:</strong> ${data.customerSignature}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Timestamp -->
            <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <strong>Authorized At:</strong> ${new Date().toLocaleString()}
                </p>

                 <p style="margin: 0; color: #6b7280; font-size: 14px;">
            <strong>User IP Address:</strong> ${ipAddress}
        </p>
            </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                This is an automated notification from your payment system.
            </p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
                © ${new Date().getFullYear()} ${data.companyName || 'Your Company'}. All rights reserved.
            </p>
        </div>

    </div>
</body>
</html>
`;

        const adminMailOptions = {
            from: 'bookings@myfaredeal.com',
            to: 'sandeepnegi2016@gmail.com',
            subject: 'Payment Authorized by CustomerF',
            html: adminHtml
        };

        try {
            await transporter.sendMail(adminMailOptions);
            console.log('Admin notified of authorized payment.');
        } catch (err) {
            console.error('Failed to send admin notification:', err);
        }


        delete tokenStore[token];
        res.redirect(`https://easyflightnow.com/thank-you?name=${data.cardholderName}`);
    } else {
        res.status(400).send('Invalid or expired authorization link.');
    }
};


module.exports = {
    sendEmail,
    authorizePayment
}; 