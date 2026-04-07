import prisma from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";


// signup
export const signup = async (req, res, next) => {
    try {
        const { email, mobile, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { mobile }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await hashPassword(password);

        const user = await prisma.user.create({
            data: { email, mobile, password: hashed }
        });

        const token = generateToken({ id: user.id });

        // store in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "User created and logged in",
            userId: user.id,
            user
        });

    } catch (err) {
        next(err);
    }
};


// login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken({ id: user.id });

        // store in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            message: "Login success"
        });

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
                isAnonymous: true 
            }
        });

        const token = generateToken({ id: user.id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day for guests
        });

        res.json({
            message: "Guest login success",
            user
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
export const logout = (req, res) => {
    res.clearCookie("token");

    res.json({
        message: "Logged out successfully"
    });
};