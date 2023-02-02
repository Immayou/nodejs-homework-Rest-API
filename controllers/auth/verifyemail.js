const { httpError } = require("../../helpers");
const { User } = require("../../models/users");

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new httpError(404, "User is not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  return res.status(200).json({ message: "Verification successful" });
}

module.exports = {
  verifyEmail,
};
