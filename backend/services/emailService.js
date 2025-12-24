import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, options = {}) => {
  try {
    // ✅ Validate inputs
    if (!to || !subject || !text) {
      throw new Error("Missing required email parameters");
    }

    // ✅ Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ Email credentials not configured in environment variables");
      throw new Error("Email service not configured properly");
    }

    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Using email: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email transporter verified successfully");

    const { isDirectMessage, replyTo } = options || {};

    const mailOptions = {
      from: `"ProMart Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      replyTo: replyTo || process.env.EMAIL_USER,
      text,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">ProMart</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">Business Directory</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 22px; margin-bottom: 25px;">${subject}</h2>
            
            <div style="font-size: 16px; line-height: 1.6; color: #4b5563;">
              ${text.replace(/\n/g, '<br>')}
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 15px; margin: 0;">
              Best regards,<br>
              <strong>The ProMart Team</strong>
              ${isDirectMessage ? '<br><span style="font-size: 13px; color: #9ca3af;">(Sent directly by Administrator)</span>' : ''}
            </p>
          </div>

          ${!isDirectMessage ? `
          <div style="text-align: center; margin-top: 25px; color: #9ca3af; font-size: 13px;">
            <p style="margin: 0;">This is an automated message, please do not reply directly to this email.</p>
            <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} ProMart. All rights reserved.</p>
          </div>
          ` : `
          <div style="text-align: center; margin-top: 25px; color: #9ca3af; font-size: 13px;">
             <p style="margin: 0;">&copy; ${new Date().getFullYear()} ProMart. All rights reserved.</p>
          </div>
          `}
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to: ${to}`);
    console.log(`✅ Message ID: ${result.messageId}`);

    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    // More specific error messages
    if (error.code === 'EAUTH') {
      console.error("❌ Authentication failed - check email credentials");
    } else if (error.code === 'EENVELOPE') {
      console.error("❌ Invalid email address");
    } else if (error.code === 'ECONNECTION') {
      console.error("❌ Connection failed - check internet connection");
    }

    throw error; // Re-throw to handle in calling function
  }
};

export default sendEmail;