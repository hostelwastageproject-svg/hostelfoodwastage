import jwt from "jsonwebtoken";

export const staffAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "staff") {
            return res.status(403).json({ message: "Access denied - Staff only" });
        }

        req.staff = {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
