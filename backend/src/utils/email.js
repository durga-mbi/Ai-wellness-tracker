import nodemailer from 'nodemailer';
import dns from 'dns';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "durgaprasad.d.mindbrain@gmail.com",
        pass: "xswx acbv htek mtsn",
    }
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
