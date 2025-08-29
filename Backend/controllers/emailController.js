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
   "sandeepnegi2016@gmail.com": {
    user: "sandeepnegi2016@gmail.com",
    pass: "oadv fzvd xuif ytef",
  },

  
};

const sendEmail = async (req, res) => {
  const data = req.body;
  console.log("Form data received in controller:", data);

  // Generate a unique token
  const token = crypto.randomBytes(20).toString("hex");
  tokenStore[token] = { data, timestamp: Date.now() }; // Store form data with token

  const senderEmail = data.email;

  // Check if the email is in your allowed list
  if (!emailAccounts[senderEmail]) {
    return res.status(400).json({ message: "Unauthorized sender email" });
  }

  const { user, pass } = emailAccounts[senderEmail];

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: user,
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
          overflow-x: hidden;
          min-width: 750px;
        
        }
        
        .container {
          max-width: 750px;
          width: 100%;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* Dynamic container sizing based on content */
        .container-normal {
          max-width: 700px !important;
          font-size: 15px !important;
        }
        
        .container-medium {
          max-width: 650px !important;
          font-size: 13px !important;
        }
        
        .container-small {
          max-width: 550px !important;
          font-size: 11px !important;
        }
        
        /* Adjust all text elements based on container size */
        .container-small h1 {
          font-size: 16px !important;
        }
        
        .container-small h2 {
          font-size: 14px !important;
        }
        
        .container-small h3 {
          font-size: 12px !important;
        }
        
        .container-small p {
          font-size: 11px !important;
        }
        
        .container-small li {
          font-size: 10px !important;
        }
        
        .container-small table th,
        .container-small table td {
          font-size: 10px !important;
          padding: 4px 6px !important;
        }
        
        .container-medium h1 {
          font-size: 20px !important;
        }
        
        .container-medium h2 {
          font-size: 18px !important;
        }
        
        .container-medium h3 {
          font-size: 16px !important;
        }
        
        .container-medium p {
          font-size: 14px !important;
        }
        
        .container-medium li {
          font-size: 13px !important;
        }
        
        .container-medium table th,
        .container-medium table td {
          font-size: 13px !important;
          padding: 8px 10px !important;
        }
        
        /* Flight summary specific styling to prevent overflow */
        .flight-summary-container {
          max-width: 100%;
          overflow-x: auto;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .flight-summary-content {
          width: 100%;
          max-width: 100%;
        }
        
        .flight-summary-content * {
          max-width: 100% !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          box-sizing: border-box !important;
        }
        
        .flight-summary-content table {
          width: 100% !important;
        }
        
        .flight-summary-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
        }
        
        /* Scrollbar styling for flight summary if needed */
        .flight-summary-container::-webkit-scrollbar {
          height: 6px;
        }
        .flight-summary-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .flight-summary-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .flight-summary-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile responsive styles for flight summary */
        @media (max-width: 768px) {
          .flight-summary-container {
            padding: 15px !important;
          }
          
          .flight-summary-content {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }
          
          .flight-summary-content h1 {
            font-size: 18px !important;
            margin: 15px 0 8px 0 !important;
          }
          
          .flight-summary-content h2 {
            font-size: 16px !important;
            margin: 12px 0 6px 0 !important;
          }
          
          .flight-summary-content h3 {
            font-size: 14px !important;
            margin: 10px 0 5px 0 !important;
          }
          
          .flight-summary-content p {
            font-size: 13px !important;
            margin: 0 0 8px 0 !important;
            line-height: 1.4 !important;
          }
          
          .flight-summary-content ul,
          .flight-summary-content ol {
            margin: 8px 0 !important;
            padding-left: 15px !important;
          }
          
          .flight-summary-content li {
            font-size: 12px !important;
            margin: 3px 0 !important;
            line-height: 1.3 !important;
          }
          
          .flight-summary-content table {
            font-size: 11px !important;
          }
          
          .flight-summary-content th,
          .flight-summary-content td {
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
          
          .flight-summary-content strong {
            font-size: 13px !important;
          }
          
          .flight-summary-content em {
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .flight-summary-container {
            padding: 0px !important;
          }
          
          .flight-summary-content {
            font-size: 10px !important;
            line-height: 1.3 !important;
          }
          
          .flight-summary-content h1 {
            font-size: 16px !important;
            margin: 12px 0 6px 0 !important;
          }
          
          .flight-summary-content h2 {
            font-size: 14px !important;
            margin: 10px 0 5px 0 !important;
          }
          
          .flight-summary-content h3 {
            font-size: 13px !important;
            margin: 8px 0 4px 0 !important;
          }
          
          .flight-summary-content p {
            font-size: 12px !important;
            margin: 0 0 6px 0 !important;
            line-height: 1.3 !important;
          }
          
          .flight-summary-content ul,
          .flight-summary-content ol {
            margin: 6px 0 !important;
            padding-left: 12px !important;
          }
          
          .flight-summary-content li {
            font-size: 11px !important;
            margin: 2px 0 !important;
            line-height: 1.2 !important;
          }
          
          .flight-summary-content table {
            font-size: 10px !important;
          }
          
          .flight-summary-content th,
          .flight-summary-content td {
            padding: 2px 4px !important;
            font-size: 10px !important;
          }
          
          .flight-summary-content strong {
            font-size: 12px !important;
          }
          
          .flight-summary-content em {
            font-size: 11px !important;
          }
        }

        @media (max-width: 360px) {
          .flight-summary-container {
            padding: 0px !important;
          }
          
          .flight-summary-content {
            font-size: 11px !important;
            line-height: 1.2 !important;
          }
          
          .flight-summary-content h1 {
            font-size: 15px !important;
            margin: 10px 0 5px 0 !important;
          }
          
          .flight-summary-content h2 {
            font-size: 13px !important;
            margin: 8px 0 4px 0 !important;
          }
          
          .flight-summary-content h3 {
            font-size: 12px !important;
            margin: 6px 0 3px 0 !important;
          }
          
          .flight-summary-content p {
            font-size: 11px !important;
            margin: 0 0 5px 0 !important;
            line-height: 1.2 !important;
          }
          
          .flight-summary-content ul,
          .flight-summary-content ol {
            margin: 5px 0 !important;
            padding-left: 10px !important;
          }
          
          .flight-summary-content li {
            font-size: 10px !important;
            margin: 2px 0 !important;
            line-height: 1.1 !important;
          }
          
          .flight-summary-content table {
            font-size: 9px !important;
          }
          
          .flight-summary-content th,
          .flight-summary-content td {
            padding: 3px 4px !important;
            font-size: 9px !important;
          }
          
          .flight-summary-content strong {
            font-size: 11px !important;
          }
          
          .flight-summary-content em {
            font-size: 10px !important;
          }
        }
        
        /* Ensure all content fits within container */
        .content-wrapper {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (max-width: 480px) {
    .section-title {
      font-size: 16px !important;
      margin-bottom: 12px !important;
    }
    
    table th, table td {
      padding: 10px 12px !important;
      font-size: 13px !important;
    }
    
    table th {
      font-size: 13px !important;
    }
    
    .total-row td {
      font-size: 15px !important;
      padding: 14px 12px !important;
    }
  }
  
  @media (max-width: 360px) {
    table th, table td {
      padding: 8px 10px !important;
      font-size: 12px !important;
    }
    
    .total-row td {
      font-size: 14px !important;
      padding: 12px 10px !important;
    }
    
    .section-title {
      font-size: 15px !important;
    }
  }




        
        /* Ensure all content fits within container */
        .content-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        /* Mobile-friendly Traveler Information Section Styles */
        .traveler-info-section .info-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
        }
        
        .traveler-info-section .info-table td {
            padding: 6px 0;
            vertical-align: top;
            word-break: break-word;
            overflow-wrap: break-word;
        }
        
        .traveler-info-section .info-table td:first-child {
            color: #6b7280;
            font-weight: 600;
            width: 35%;
            padding-right: 10px;
        }
        
        .traveler-info-section .info-table td:last-child {
            color: #1f2937;
            font-weight: 500;
            font-size: 16px;
            width: 65%;
        }
        
        .traveler-info-section .passengers-list {
            margin: 0;
            padding-left: 20px;
            color: #374151;
        }
        
        /* Mobile responsive styles for traveler info only */
        @media (max-width: 768px) {
            .traveler-info-section .section-title {
                font-size: 18px !important;
                margin-bottom: 15px !important;
                padding-bottom: 10px !important;
            }
            
            .traveler-info-section .info-box {
                padding: 15px !important;
            }
            
            /* Stack table layout on mobile */
            .traveler-info-section .info-table,
            .traveler-info-section .info-table tbody,
            .traveler-info-section .info-table tr,
            .traveler-info-section .info-table td {
                display: block;
            }
            
            .traveler-info-section .info-table tr {
                margin-bottom: 15px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 10px;
            }
            
            .traveler-info-section .info-table tr:last-child {
                margin-bottom: 0;
                border-bottom: none;
            }
            
            .traveler-info-section .info-table td {
                padding: 0 !important;
                width: 100% !important;
            }
            
            .traveler-info-section .info-table td:first-child {
                font-size: 14px;
                margin-bottom: 5px;
                padding-right: 0 !important;
                font-weight: 700;
                color: #374151;
            }
            
            .traveler-info-section .info-table td:last-child {
                font-size: 15px;
                padding-left: 10px;
                border-left: 3px solid #3b82f6;
            }
            
            .traveler-info-section .passengers-list {
                padding-left: 15px;
                margin-top: 5px;
            }
        }
        
        @media (max-width: 480px) {
            .traveler-info-section .section-title {
                font-size: 16px !important;
                margin-bottom: 12px !important;
            }
            
            .traveler-info-section .info-table td:first-child {
                font-size: 13px !important;
            }
            
            .traveler-info-section .info-table td:last-child {
                font-size: 14px !important;
            }
            
            .traveler-info-section .passengers-list {
                font-size: 14px;
                padding-left: 12px;
            }
        }
        
        @media (max-width: 360px) {
            .traveler-info-section .section-title {
                font-size: 15px !important;
                margin-bottom: 10px !important;
            }
            
            .traveler-info-section .info-table td:first-child {
                font-size: 12px !important;
            }
            
            .traveler-info-section .info-table td:last-child {
                font-size: 13px !important;
                padding-left: 8px !important;
            }
            
            .traveler-info-section .passengers-list {
                font-size: 13px;
                padding-left: 10px;
            }
        }

        

      </style>
    </head>
   <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; overflow-x: hidden; min-width: ${containerWidth};">
      
      <div class="container ${containerClass}" style="max-width: ${containerWidth}; font-size: ${
      containerFontSize === "normal"
        ? "16px"
        : containerFontSize === "medium"
        ? "14px"
        : "12px"
    };">
        
        <!-- Header -->
        <div class="header" style="background: linear-gradient(135deg, #1aa45e 0%, #176e69 50%, #118ba0 100%); padding: 10px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%);"></div>
          <div style="position: relative; z-index: 1;">
          <span style="color: rgba(255,255,255,0.9); font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
           ✅ Confirmed 
          </span> 
          <h1 style="color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 600; text-transform: lowercase; letter-spacing: 1px;">
           Authorization Successful
          </h1>

        
          </div>
        </div>

        <!-- Main Content --> 
        <div class="content content-wrapper" style="padding: 10px; width: 100%; max-width: 100%; overflow-x: hidden; word-wrap: break-word; overflow-wrap: break-word;">
          
          <!-- Welcome Message -->
          <div class="welcome-box" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 16px; font-weight: 500; word-break: break-word;">
              Dear ${data.cardholderName || "Valued Customer"},
            </p>
            <p style="margin: 10px 0 0 0; color: #374151; font-size: 12px; line-height: 1.5;">
              We need your authorization to process the payment for your booking. Please review the details below and click the authorization button to proceed.
            </p>
          </div>


          <!-- Traveler Information Section -->

          <div class="traveler-info-section">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
                Traveler Information
            </h2>
            <div class="info-box" style="background-color: #f9fafb; padding: 10px; border-radius: 10px; border: 1px solid #e5e7eb;">
                <table class="info-table">
                    <tr>
                        <td>Booking Reference:</td>
                        <td>${data.bookingReference}</td>
                    </tr>
                    <tr>
                        <td>Customer Email:</td>
                        <td>${data.customerEmail}</td>
                    </tr>
                    <tr>
                        <td>Passenger(s):</td>
                        <td>
                             <ul style="margin: 0; padding-left: 20px; color: #374151;">
                            ${passengersList}
                             </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>Contact Number:</td>
                        <td> ${data.contactNo} </td>
                    </tr>
                </table>
            </div>
        </div>



         <!-- Booking Details Section -->
          <div style="margin-bottom: 35px; margin-top: 10px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
               Flight Summary
            </h2>
            <div class="flight-summary-container" style="padding: ${
              containerFontSize === "small"
                ? "0px"
                : containerFontSize === "medium"
                ? "15px"
                : "18px"
            }; border-radius: 10px; border-left: 4px solid #f5e4b1ff; max-width: 100%; overflow-x: auto; word-wrap: break-word; overflow-wrap: break-word;">
  <div class="flight-summary-content" style="color: #374151; font-size: ${
    containerFontSize === "small"
      ? "10px"
      : containerFontSize === "medium"
      ? "12px"
      : "14px"
  }; line-height: 1.6; word-break: break-word;">
    ${cleanFlightSummary(data.flightSummary)}
  </div>
</div>
  </div>




<!-- Charge Description -->
${
  Array.isArray(data.chargeDescription) &&
  data.chargeDescription.some((item) => {
    // Check for any description field or amount
    const hasDescription = Object.keys(item).some(
      (key) => key.startsWith("description_") && item[key]
    );
    return hasDescription || item.amount;
  })
    ? `
<div style="margin: 0 auto; overflow-x: auto; -webkit-overflow-scrolling: touch;">
<table style="width: 100%; min-width: 320px; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
<thead>
<tr style="background: #1e40af;">
<th style="padding: 12px 16px; text-align: left; color: #ffffff; font-weight: 600; font-size: 12px; border: none; min-width: 200px;">Description</th>
<th style="padding: 12px 16px; text-align: right; color: #ffffff; font-weight: 600; font-size: 12px; border: none; min-width: 120px;">Amount</th>
</tr>
</thead>
<tbody>
${data.chargeDescription
  .map((item, index) => {
    // Find the first available description field dynamically
    let description = "Service Charge";

    // Look for description fields in order (description_1, description_2, etc.)
    const descriptionKeys = Object.keys(item)
      .filter((key) => key.startsWith("description_"))
      .sort((a, b) => {
        const numA = parseInt(a.split("_")[1]) || 0;
        const numB = parseInt(b.split("_")[1]) || 0;
        return numA - numB;
      });

    // Use the first non-empty description found
    for (const key of descriptionKeys) {
      if (item[key] && item[key].trim()) {
        description = item[key];
        break;
      }
    }

    let amount = item.amount || "$0.00";
    description = description.replace(/\t+/g, " ").trim();

    const isLastItem = index === data.chargeDescription.length - 1;

    if (isLastItem) {
      return `
<tr style="background: #fef3c7; border-top: 2px solid #f59e0b;">
<td style="padding: 16px 16px; color: #92400e; font-weight: 700; font-size: 10px; border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${description}</td>
<td style="padding: 16px 16px; color: #92400e; font-weight: 700; font-size: 10px; text-align: right; border: none; word-break: break-word;">${amount}</td>
</tr>
`;
    } else {
      return `
<tr style="background: ${index % 2 === 0 ? "#f8fafc" : "#ffffff"};">
<td style="padding: 12px 16px; color: #374151; font-weight: 600; font-size: 15px; border: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
${description}
</td>
<td style="padding: 12px 16px; color: #374151; font-weight: 500; font-size: 15px; text-align: right; border: none; word-break: break-word;">
${amount}
</td>
</tr>
`;
    }
  })
  .join("")}
</tbody>
</table>
</div>
`
    : ""
}



<!-- Charge breakdown -->
${
  Array.isArray(data.chargeBreakdown) &&
  data.chargeBreakdown.some((item) => item.merchant || item.amount)
    ? `
<div style="margin: 0 auto; overflow-x: auto; -webkit-overflow-scrolling: touch;">
  <h2 class="section-title" style="margin-top: 10px; color: #1f2937; font-size: 20px; margin-bottom: 10px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
    Charge breakdown
  </h2>

  <table style="width: 100%; min-width: 320px; border-collapse: collapse; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <thead>
      <tr style="background: #1e40af;">
        <th style="padding: 12px 16px; text-align: left; color: #ffffff; font-weight: 600; font-size: 14px; border: none; min-width: 120px;">Merchant Name</th>
        <th style="padding: 12px 16px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px; border: none; min-width: 100px;">Amount (USD)</th>
      </tr>
    </thead>
    <tbody>
      ${data.chargeBreakdown
        .map((charge, index, arr) => {
          const isLast = index === arr.length - 1;
          const isTotal = charge.merchant?.toLowerCase() === "total";

          if (isLast && isTotal) {
            return `
            <tr style="background: #fef3c7; border-top: 2px solid #f59e0b;">
              <td style="padding: 16px 16px; color: #92400e; font-weight: 700; font-size: 14px; border: none; text-transform: capitalize;">
                ${charge.merchant}
              </td>
              <td style="padding: 16px 16px; color: #92400e; font-weight: 700; font-size: 14px; text-align: right; border: none;">
                $${parseFloat(charge.amount || 0).toFixed(2)}
              </td>
            </tr>
            `;
          } else {
            return `
            <tr style="background: ${index % 2 === 0 ? "#f8fafc" : "#ffffff"};">
              <td style="padding: 12px 16px; color: #374151; font-weight: 600; font-size: 14px; border: none; text-transform: capitalize; word-wrap: break-word;">
                ${charge.merchant || "Service Provider"}
              </td>
              <td style="padding: 12px 16px; color: #374151; font-weight: 500; font-size: 14px; text-align: right; border: none; white-space: nowrap;">
                $${parseFloat(charge.amount || 0).toFixed(2)}
              </td>
            </tr>
            `;
          }
        })
        .join("")}
    </tbody>
  </table>
</div>
`
    : ""
}




          <!-- Payment Information Section -->
          <div style="margin-bottom: 35px;">
            <h2 class="section-title" style="color: #1f2937; font-size: 20px; margin-bottom: 20px; display: flex; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-top: 14px;">
               Payment Details
            </h2>
            <div class="info-box" style="background-color: #f0fdf4; padding: 10px; border-radius: 10px; border: 1px solid #bbf7d0; border-left: 4px solid #22c55e;">
              <table class="info-table" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; width: 35%; vertical-align: top;">Cardholder Name:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-size: 16px; word-break: break-word; width: 65%;">${
                    data.cardholderName
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Card Type:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${
                    data.cardType
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Card Number:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; font-family: monospace;">**** **** **** ${data.cardNumber.slice(
                    -4
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Expiration Date:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500;">${
                    data.expiryDate
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #166534; font-weight: 600; vertical-align: top;">Billing Email:</td>
                  <td style="padding: 10px 0; color: #1f2937; font-weight: 500; word-break: break-word;">${
                    data.billingEmail
                  }</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Authorization Agreement Section -->
          <div style="margin-bottom: 35px;">
            <div class="info-box" style="background-color: #fef2f2; padding: 12px; border-radius: 10px; border: 1px solid #fecaca; border-left: 4px solid #ef4444;">
              <p class="auth-text" style="margin: 0 0 15px 0; color: #374151; font-size: 12px; line-height: 1.8; text-align: justify; word-break: break-word;">
                As per our telephonic conversation and as agreed, I, <strong>${
                  data.cardholderName
                }</strong>, 
                authorize <strong>${
                  data.companyName || "the merchant"
                }</strong> to charge <strong>USD $${data.amount}</strong> 
                to the above credit card for <strong>${
                  data.serviceDetails
                }</strong>.
              </p>
              <div class="terms-inner" style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 3px solid #ef4444; margin-top: 15px;">
                <p style="margin: 0; color: #313131ff; font-size: 12px; font-weight: 600;">
                   Important Terms & Conditions:
                </p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #374151; font-size: 12px;">
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
 <p class="signature-text" style="margin: 0; color: #1f2937; font-size: 22px; font-weight: 500; background-color: #ffffff; padding: 10px; border-radius: 6px; display: inline-block; min-width: 200px; word-break: break-word; font-family: 'Dancing Script', cursive; text-transform: lowercase;">
  ${data.cardholderName}
</p>

</div>

         <!-- Scrollable Terms & Conditions -->
        <div class="terms-box" style="max-height: 550px; overflow-y: auto; background-color: #fff7ed; border: 1px solid #fde68a; padding: 20px; border-radius: 10px; font-size: 10px; color: #374151; line-height: 1.7; word-wrap: break-word; overflow-wrap: break-word;">
          <strong>Terms & Conditions</strong><br /><br />
          Tickets are <strong>Non-Refundable/Non-Transferable</strong> and name changes are not permitted.<br />
          Date and routing changes will be subject to Airline Penalty and Fare Difference if any.<br />
          Fares are not guaranteed until ticketed.<br />
          For any modification or changes please contact our Travel Consultant on <strong>+1-844-480-0252</strong>.<br />
          All customers are advised to verify travel documents (transit visa/entry visa) for the country through which they are transiting and/or entering. We will not be responsible if proper travel documents are not available and you are denied entry or transit into a Country.<br />
          We request you to consult the embassy of the country(s) you are visiting or transiting through.<br />
          These terms and conditions ("terms of use") apply to you right the moment you access and use ${
            data.companyName
          }: its services, products, and contents. This is a legal agreement between you and ${
      data.companyName
    }.<br />
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

<div style="margin-top: 20px;">
  <div style=" margin: 0 auto;">
    <div style="margin-bottom: 32px;">
      <p style="color: #374151; font-size: 18px; font-weight: 600; margin-bottom: 24px;">Regards,</p>
      
      <div style="background: #ffffff; border-radius: 16px; padding: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 3px solid #3b82f6;">
       
        
        <div style="space-y: 12px;">


        <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style=" padding: 8px;  min-width: 30px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">👤</span>
            </div>
            <div>
              <p style="color: #425067ff; font-weight: 600; margin: 0; font-size: 15px; padding-top: 10px;"> ${
                data.name
              } </p>
            </div>
          </div>


          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style=" padding: 8px;  min-width: 30px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">📞</span>
            </div>
            <div>
              <p style="color: #374151; font-weight: 600; margin: 0; font-size: 12px;">+1-844-480-0252</p>
              <p style="color: #6b7280; font-size: 9px; margin: 0;">Toll Free Number</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: center;">
            <div style="padding: 8px;  min-width: 30px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 16px;">📧</span>
            </div>
            <div>
              <p style="color: #374151; font-weight: 600; margin: 0; font-size: 12px;">${
                data.email
              }</p>
              <p style="color: #6b7280; font-size: 9px; margin: 0;">Email Address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  </div>
</div>

        </div>

         <!-- System Information -->
            <div style="border-radius: 20px; padding: 10px; margin-bottom: 50px;">
              <div style="max-width: 600px; margin: 0 auto; text-align: center;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                  <div style="background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <p style="color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Authorization Time</p>
                    <p style="color: #1f2937; font-size: 16px; font-weight: 700; margin: 0;">
                      ${new Date().toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                  </div>
                  
                  <div style=" border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <p style="color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">IP Address</p>
                    <p style="color: #1f2937; font-size: 16px; font-weight: 700; margin: 0; font-family: monospace; word-break: break-all;">
                      ${ipAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

        <!-- Footer -->
        <div class="footer" style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; line-height: 1.4;">
            Need help? Contact our support team
          </p>
         
          <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px; line-height: 1.4;">
            © ${new Date().getFullYear()} ${
      data.companyName || "Your Merchant"
    }. All rights reserved.
          </p>
        </div>

      </div>

    </body>
    </html>`;

    const adminMailOptions = {
      from: "bookings@myfaredeal.com",
      to: `${data.email}, arun@farebulk.com, sam@farebulk.com, sandeepnegi2013@gmail.com`,
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

    // res.redirect(
    //   `http://localhost:3080/thank-you?name=${data.cardholderName}&merchant=${data.companyName}`
    // );
  } else {
    res.status(400).send("Invalid or expired authorization link.");
  }
};

module.exports = {
  sendEmail,
  authorizePayment,
};
