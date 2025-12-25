import Organization from "../models/Organization.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const joinOrganization = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const org = await Organization.findOne({ inviteCode });
    if (!org) return res.status(400).json({ message: "Invalid invite code" });

    const user = await User.findById(req.user.id);

    user.orgId = org._id;
    await user.save();

    if (!org.members.includes(user._id)) {
      org.members.push(user._id);
      await org.save();
    }

    // same style as register/login
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        orgId: user.orgId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Joined organization",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
    });
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
