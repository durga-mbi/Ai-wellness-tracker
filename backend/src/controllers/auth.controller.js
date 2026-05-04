import prisma from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";


import { sendOTP } from "../utils/email.js";

const generateRandomOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// signup
export const signup = async (req, res, next) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required for registration" });
        }

        const config = await prisma.systemConfig.findFirst();
        const authMode = config?.authMode || "standard";

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        const hashed = await hashPassword(password);
        
        if (authMode === "otp") {
            const otp = generateRandomOtp();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

            if (existingUser) {
                if (existingUser.isVerified) {
                    return res.status(400).json({ message: "User already exists and is verified" });
                }
                // If exists but not verified, update OTP and resend
                await prisma.user.update({
                    where: { email },
                    data: { password: hashed, name, mobile, otp, otpExpiry }
                });
            } else {
                // Create new unverified user
                await prisma.user.create({
                    data: {
                        name,
                        email,
                        mobile,
                        password: hashed,
                        location: "",
                        otp,
                        otpExpiry,
                        isVerified: false
                    }
                });
            }

            const emailSent = await sendOTP(email, otp);
            if (!emailSent) {
                return res.status(500).json({ message: "Failed to send OTP email" });
            }

            return res.status(200).json({
                message: "OTP sent to email",
                requireOtp: true,
                email
            });
        } else {
            // Standard registration (without OTP)
            let user;
            if (existingUser) {
                user = await prisma.user.update({
                    where: { email },
                    data: { password: hashed, name, mobile, isVerified: true }
                });
            } else {
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        mobile,
                        password: hashed,
                        location: "",
                        isVerified: true
                    }
                });
            }

            const token = generateToken({ id: user.id });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(201).json({
                message: "Registration successful",
                requireOtp: false,
                user,
                token
            });
        }

    } catch (err) {
        next(err);
    }
};

// verify OTP
export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // OTP is valid, verify user
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { isVerified: true, otp: null, otpExpiry: null }
        });

        const token = generateToken({ id: updatedUser.id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: "Verification successful. You are logged in.",
            user: updatedUser,
            token
        });

    } catch (err) {
        next(err);
    }
};

// login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { mobile: email }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check auth mode — only block unverified users in OTP mode
        const config = await prisma.systemConfig.findFirst();
        const authMode = config?.authMode || "standard";

        if (authMode === "otp" && !user.isAnonymous && user.email && !user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first", unverified: true, email: user.email });
        }

        // In standard mode, auto-verify any unverified user on login
        if (authMode === "standard" && !user.isVerified && !user.isAnonymous) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true }
            });
            user.isVerified = true;
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken({ id: user.id });

        // store in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: "Login success",
            user,
            token
        });

    } catch (err) {
        next(err);
    }
};

// forgot password - send OTP
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "If this email exists, an OTP will be sent." }); // Security best practice
        }

        const otp = generateRandomOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiry }
        });

        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        next(err);
    }
};

// reset password
export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        const hashed = await hashPassword(newPassword);

        await prisma.user.update({
            where: { email },
            data: { password: hashed, otp: null, otpExpiry: null }
        });

        res.status(200).json({ message: "Password has been successfully reset" });
    } catch (err) {
        next(err);
    }
};


// guest login
export const guestLogin = async (req, res, next) => {
    try {
        const user = await prisma.user.create({
            data: { 
                name: "Guest User",
                isAnonymous: true,
                location: "" 
            }
        });

        const token = generateToken({ id: user.id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 // 1 day for guests
        });

        res.json({
            message: "Guest login success",
            user,
            token // Include token for header-based auth
        });

    } catch (err) {
        next(err);
    }
};

// get login user current
export const getMe = (req, res) => {
    res.json({
        user: req.user
    });
};


// logout 
export const logout = async (req, res) => {
    try {
        // Reset system setup on logout
        await prisma.systemConfig.updateMany({
            data: { setupCompleted: false }
        });

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.json({
            message: "Logged out successfully and system reset"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed" });
    }
};
