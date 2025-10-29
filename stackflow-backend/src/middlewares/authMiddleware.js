import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token should come as: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Store user data in req.user
    next(); // Continue to the next middleware or route
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};