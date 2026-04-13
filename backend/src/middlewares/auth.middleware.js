// import jwt from "jsonwebtoken";

// export const protect = (req, res, next) => {
//     try {
//         const token = req.cookies.token; // from cookie

//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;

//         next();

//     } catch (err) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };



import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not logged in - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // fetch user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                ageGroup: true,
                university: true,
                isAnonymous: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // attach user to request
        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};