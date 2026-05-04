import nodemailer from "nodemailer";

/**
 * Sends an OTP email using Nodemailer.
 * Requires the following environment variables:
 * - EMAIL_USER: The email address to send from (e.g., your-gmail@gmail.com)
 * - EMAIL_PASS: The app-specific password for the email account
 */
export const sendOTP = async (to, otp) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: `"MindMetrics AI" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Your MindMetrics Verification Code',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f4f6d2;">
                    <h2 style="color: #373a1c; margin-bottom: 20px;">Verification Required</h2>
                    <p style="color: #636745; font-size: 16px; margin-bottom: 30px;">
                        Use the following One-Time Password (OTP) to verify your account. The code is valid for 10 minutes.
                    </p>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; display: inline-block; border: 2px dashed #b9bc94; margin-bottom: 30px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #506b4a;">${otp}</span>
                    </div>
                    <p style="color: #636745; font-size: 14px; opacity: 0.8;">
                        If you did not request this, please ignore this email.
                    </p>
                </div>
            `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully using Nodemailer:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email with Nodemailer:", error);
        return false;
    }
};