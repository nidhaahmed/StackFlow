import Organization from "../models/Organization.js";
import User from "../models/User.js";

export const joinOrganization = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const org = await Organization.findOne({ inviteCode });
    if (!org) return res.status(400).json({ message: "Invalid invite code" });

    const user = await User.findById(req.user.id);

    // Update user's organization
    user.orgId = org._id;
    await user.save();

    // Add user to organization members
    if (!org.members.includes(user._id)) {
      org.members.push(user._id);
      await org.save();
    }

    res.status(200).json({ message: "Joined organization", org });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInviteCode = async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId);
    if (!org)
      return res.status(404).json({ message: "Organization not found" });

    res.status(200).json({ inviteCode: org.inviteCode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
