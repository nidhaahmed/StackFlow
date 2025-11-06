import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  try {
    // Authorization header format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid or expired token" });

      // Attach user data to request for later use
      req.user = user; // contains { id, role }
      next();
    });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ message: "Server error verifying token" });
  }
};
