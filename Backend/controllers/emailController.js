const nodemailer = require("nodemailer");
const generateEmailTemplate = require("../emailTemplate");
const crypto = require("crypto");

// In-memory store for tokens. In a real app, use a database.
const tokenStore = {};

// Define email accounts and app passwords
const emailAccounts = {
  "antonio@myfaredeal.com": {
    user: "antonio@myfaredeal.com",
    pass: "tskx gcid ncnx whap",
  },
  "kriss@myfaredeal.com": {
    user: "kriss@myfaredeal.com",
    pass: "urcz wqvh gkpe ubdg",
  },
  "ruben@myfaredeal.com": {
    user: "ruben@myfaredeal.com",
    pass: "gruq klrs qoca ogtl",
  },
   "maria@myfaredeal.com" : {
    user: "maria@myfaredeal.com",
    pass: "nkhq zlqx uccl wbmm",
  },
    "sid@myfaredeal.com" : {
    user: "sid@myfaredeal.com",
    pass: "fxid bcsy klzg rqwf",
  },
   "mario@myfaredeal.com" : {
    user: "mario@myfaredeal.com",
    pass: "yhff vpuz slkh ymlo",
  },
   "parnbartwal@gmail.com": {
    user: "parnbartwal@gmail.com",
    pass: "epzw gzvq rcor fccx",
  },

  
};

const sendEmail = async (req, res) => {
  const data = req.body;
  console.log("Form data received in controller:", data);

  // Generate a unique token
  const token = crypto.randomBytes(20).toString("hex");
  tokenStore[token] = { data, timestamp: Date.now() };

  const senderEmail = data.email;

  // Check if the email is in your allowed list
  if (!emailAccounts[senderEmail]) {
    return res.status(400).json({ message: "Unauthorized sender email" });
  }

  const { user, pass } = emailAccounts[senderEmail];

  // Use Gmail SMTP (for your existing accounts)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const mailOptions = {
    from: '"FlightsHoldings Support" <support@flightsholdings.com>', // What customer sees
    replyTo: user, // Replies go to the actual sender (Gmail account)
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
    console.log(`Token received: ${token}`);

    const { data, timestamp } = tokenStore[token];

    const getIp = (req) => {
      const forwarded = req.headers["x-forwarded-for"];
      return forwarded
        ? forwarded.split(",")[0].trim()
        : req.socket.remoteAddress;
    };

    const ipAddress = getIp(req);
    console.log(`IP Address: ${ipAddress}`);

    // ... [Your existing code for building adminHtml] ...


    const passengersList =
      data.passengers && data.passengers.length
        ? data.passengers
            .map((p) => `<li style="margin: 5px 0; color: #374151;">${p}</li>`)
            .join("")
        : '<li style="margin: 5px 0; color: #6b7280;">No passengers listed</li>';

    if (Date.now() - timestamp > 4600000) {
      delete tokenStore[token];
      return res.status(400).send("Authorization link has expired.");
    }

    const analyzeFlightSummary = (htmlContent) => {
      if (!htmlContent || htmlContent.trim() === "") {
        return {
          hasContent: false,
          contentLength: 0,
          hasTables: false,
          hasLongText: false,
        };
      }

      // Remove HTML tags to get text length
      const textContent = htmlContent.replace(/<[^>]*>/g, "");
      const contentLength = textContent.length;

      // Check for tables
      const hasTables =
        htmlContent.includes("<table") ||
        htmlContent.includes("<tr") ||
        htmlContent.includes("<td");

      // Check for long text (more than 500 characters)
      const hasLongText = contentLength > 500;

      // Check for multiple paragraphs or complex structure
      const paragraphCount = (htmlContent.match(/<p[^>]*>/g) || []).length;
      const listCount = (htmlContent.match(/<[uo]l[^>]*>/g) || []).length;
      const headingCount = (htmlContent.match(/<h[1-6][^>]*>/g) || []).length;

      const isComplex =
        paragraphCount > 3 || listCount > 1 || headingCount > 2 || hasTables;

      return {
        hasContent: true,
        contentLength,
        hasTables,
        hasLongText,
        isComplex,
        paragraphCount,
        listCount,
        headingCount,
      };
    };

    const flightSummaryAnalysis = analyzeFlightSummary(data.flightSummary);

    // Determine container size based on flight summary content
    let containerWidth, containerFontSize, containerClass;

    if (
      !flightSummaryAnalysis.hasContent ||
      flightSummaryAnalysis.contentLength < 100
    ) {
      // Minimal content - smaller size
      containerWidth = "650px";
      containerFontSize = "medium";
      containerClass = "container-medium";
    } else if (
      flightSummaryAnalysis.isComplex ||
      flightSummaryAnalysis.hasTables ||
      flightSummaryAnalysis.contentLength > 1000
    ) {
      // Complex content or long text - very small container
      containerWidth = "500px";
      containerFontSize = "small";
      containerClass = "container-small";
    } else if (flightSummaryAnalysis.contentLength > 500) {
      // Medium content - small container
      containerWidth = "550px";
      containerFontSize = "small";
      containerClass = "container-small";
    } else {
      // Default - medium size
      containerWidth = "650px";
      containerFontSize = "medium";
      containerClass = "container-medium";
    }

    const cleanFlightSummary = (htmlContent) => {
      if (!htmlContent || htmlContent.trim() === "") {
        return '<p style="color: #6b7280; font-style: italic;">No flight details provided</p>';
      }

      // Remove any script tags for security
      const cleanHtml = htmlContent.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );

      // Get font sizes based on container size
      const getFontSizes = () => {
        if (containerFontSize === "small") {
          return {
            p: "10px",
            h1: "14px",
            h2: "12px",
            h3: "11px",
            li: "9px",
            table: "9px",
            td: "9px",
            th: "9px",
            pre: "9px",
            code: "9px",
          };
        } else if (containerFontSize === "medium") {
          return {
            p: "12px",
            h1: "16px",
            h2: "14px",
            h3: "12px",
            li: "11px",
            table: "11px",
            td: "11px",
            th: "11px",
            pre: "11px",
            code: "11px",
          };
        } else {
          return {
            p: "14px",
            h1: "20px",
            h2: "16px",
            h3: "14px",
            li: "12px",
            table: "12px",
            td: "12px",
            th: "12px",
            pre: "12px",
            code: "12px",
          };
        }
      };

      const fontSizes = getFontSizes();

      // Ensure proper styling for email compatibility with responsive design
      return (
        cleanHtml
          .replace(
            /<p>/g,
            `<p style="margin: 0 0 10px 0; color: #374151; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word; font-size: ${fontSizes.p};">`
          )
          .replace(
            /<h1>/g,
            `<h1 style="color: #1f2937; margin: 20px 0 10px 0; font-size: ${fontSizes.h1}; font-weight: 700; word-wrap: break-word; overflow-wrap: break-word;">`
          )
          .replace(
            /<h2>/g,
            `<h2 style="color: #1f2937; margin: 18px 0 8px 0; font-size: ${fontSizes.h2}; font-weight: 600; word-wrap: break-word; overflow-wrap: break-word;">`
          )
          .replace(
            /<h3>/g,
            `<h3 style="color: #1f2937; margin: 16px 0 6px 0; font-size: ${fontSizes.h3}; font-weight: 600; word-wrap: break-word; overflow-wrap: break-word;">`
          )
          .replace(
            /<ul>/g,
            '<ul style="margin: 10px 0; padding-left: 20px; color: #374151; word-wrap: break-word; overflow-wrap: break-word;">'
          )
          .replace(
            /<ol>/g,
            '<ol style="margin: 10px 0; padding-left: 20px; color: #374151; word-wrap: break-word; overflow-wrap: break-word;">'
          )
          .replace(
            /<li>/g,
            `<li style="margin: 5px 0; color: #374151; line-height: 1.5; word-wrap: break-word; overflow-wrap: break-word; font-size: ${fontSizes.li};">`
          )
          .replace(
            /<strong>/g,
            '<strong style="font-weight: 700; color: #1f2937;">'
          )
          .replace(/<em>/g, '<em style="font-style: italic; color: #4b5563;">')
          .replace(
            /<a /g,
            '<a style="color: #3b82f6; text-decoration: none; word-wrap: break-word; overflow-wrap: break-word;" '
          )
          .replace(
            /<img /g,
            '<img style="max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0; display: block;" '
          )
          .replace(
            /<table>/g,
            `<table style="width: 100%; max-width: 100%; border-collapse: collapse; margin: 15px 0; word-wrap: break-word; overflow-wrap: break-word; font-size: ${fontSizes.table};">`
          )
          .replace(
            /<td>/g,
            `<td style="padding: 8px; border: 1px solid #e5e7eb; color: #374151; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top; font-size: ${fontSizes.td};">`
          )
          .replace(
            /<th>/g,
            `<th style="padding: 8px; border: 1px solid #e5e7eb; background-color: #f3f4f6; color: #1f2937; font-weight: 600; text-align: left; word-wrap: break-word; overflow-wrap: break-word; vertical-align: top; font-size: ${fontSizes.th};">`
          )
          .replace(
            /<div>/g,
            '<div style="margin: 5px 0; word-wrap: break-word; overflow-wrap: break-word;">'
          )
          .replace(/<br>/g, "<br/>")
          // Add specific handling for any remaining elements that might cause overflow
          .replace(
            /<pre>/g,
            `<pre style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; font-size: ${fontSizes.pre}; overflow-x: auto;">`
          )
          .replace(
            /<code>/g,
            `<code style="word-wrap: break-word; overflow-wrap: break-word; font-size: ${fontSizes.code};">`
          )
      );
    };

    // === SEND ADMIN EMAIL USING HOSTINGER ===
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: "support@flightsholdings.com", // Your Hostinger email
        pass: "your_hostinger_password", // Your Hostinger password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const adminMailOptions = {
      from: '"FlightsHoldings Support" <support@flightsholdings.com>',
      to: `${data.email}, arun@farebulk.com, sam@farebulk.com, sandeepnegi2013@gmail.com`,
      subject: "Payment Authorized by Customer",
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
