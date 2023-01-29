const { httpError } = require("../../helpers");
const { User } = require("../../models/users");
const path = require("path");
const fs = require("fs/promises");
var Jimp = require("jimp");

async function avatarUpdate(req, res, next) {
  const { _id } = req.user;
  const user = await User.findOne({ _id });

  if (!user) {
    throw new httpError(401, "Not authorized");
  }
  try {
    const { filename } = req.file;
    const tmpPath = path.resolve(__dirname, "../../tmp", filename);
    const newPath = path.resolve(__dirname, "../../public/avatars", filename);
    console.log(_id + "Avatar" + path.extname(filename));
    const nameOfAvatarImage = `${_id} + "Avatar" + ${path.extname(filename)}`;
    await Jimp.read(tmpPath)
      .then((filename) => {
        return filename
          .resize(250, 250)
          .write(path.resolve(__dirname, "../../tmp", `${_id}+ "Avatar" `));
      })
      .catch((err) => {
        console.error(err);
      });
    // await fs.rename(tmpPath, newPath);

    const userWithUpdatedAvatar = await User.findOneAndUpdate(
      _id,
      {
        avatarURL: `/avatars/${filename}`,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ avatarURL: userWithUpdatedAvatar.avatarURL });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  avatarUpdate,
};
