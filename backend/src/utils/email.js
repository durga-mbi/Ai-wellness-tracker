import nodemailer from 'nodemailer';
import dns from 'dns';

// Force DNS resolution to IPv4 first, preventing ENETUNREACH on IPv6-broken servers (like Render)
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Add debugging and strict timeouts to prevent silent hangs in production
    logger: true,
    debug: true,
    connectionTimeout: 10000, // Fail if cannot connect within 10 seconds
    greetingTimeout: 10000,   // Fail if greeting takes longer than 10 seconds
    socketTimeout: 10000,     // Fail if socket becomes idle
});

export const sendOTP = async (to, otp) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"MindMetrics AI" <noreply@mindmetrics.ai>',
            to,
            subject: 'Your MindMetrics Verification Code',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #f4f6d2;">
                    <h2 style="color: #373a1c; margin-bottom: 20px;">Verification Required</h2>
                    <p style="color: #636745; font-size: 16px; margin-bottom: 30px;">
                        Use the following One-Time Password (OTP) to verify your account or reset your password. The code is valid for 10 minutes.
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

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
