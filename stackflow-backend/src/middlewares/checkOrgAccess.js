export const checkOrgAccess = (model) => {
  return async (req, res, next) => {
    try {
      const doc = await model.findById(
        req.params.id ||
          req.params.projectId ||
          req.params.milestoneId ||
          req.params.taskId
      );

      if (!doc) return res.status(404).json({ message: "Resource not found" });

      if (doc.orgId.toString() !== req.user.orgId.toString()) {
        return res
          .status(403)
          .json({ message: "Forbidden: different organization" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
};
