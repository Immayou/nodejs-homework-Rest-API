const { User } = require("../../models/users");
const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");

const avatarUpdate = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });

    if (!user) {
      throw new httpError(401, "Not authorized");
    }

    const { path: tmpPath, originalname } = req.file;

    try {
      await Jimp.read(tmpPath).then((avatar) => {
        return avatar.resize(250, 250).writeAsync(tmpPath);
      });
    } catch (error) {
      return next(error);
    }

    const imageFormat = path.extname(originalname);
    const avatarNewName = `${_id}_Avatar${imageFormat}`;

    const newPath = path.resolve(
      __dirname,
      "../../public/avatars",
      avatarNewName
    );

    try {
      await fs.rename(tmpPath, newPath);
    } catch (err) {
      await fs.unlink(tmpPath);
      return next(err);
    }

    const avatarURL = path.join("public", "avatars", avatarNewName);
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatarURL },
      { new: true }
    );

    return res.status(200).json({
      data: {
        user: {
          avatarURL: updatedUser.avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  avatarUpdate,
};
