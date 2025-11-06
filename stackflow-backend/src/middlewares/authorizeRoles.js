export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient privileges." });
      }
      next();
    } catch (err) {
      console.error("Role authorization error:", err);
      res.status(500).json({ message: "Server error during authorization" });
    }
  };
};
