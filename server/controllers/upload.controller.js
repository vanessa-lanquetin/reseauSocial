const UserModel = require("../models/user.model");
const { move, existsSync, mkdirp, remove } = require("fs-extra");
const pathfs = require("path");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");
const { v4 } = require("uuid");


module.exports.uploadProfil = async (req, res) => {
  try {
    if (
      req.file.mimetype !== "image/jpg" &&
      req.file.mimetype !== "image/png" &&
      req.file.mimetype !== "image/jpeg"
    )
      throw new Error("invalid file");

    if (req.file.size > 500000) throw new Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(400).json({ errors });
  }

  const fileName = v4() + ".jpg";

  try {
    const uploadPath = pathfs.resolve(
      __dirname,
      "..",
      "..",
      "client",
      "public",
      "uploads",
      "profil"
    );
    const targetPath = pathfs.resolve(uploadPath, fileName);

    if (!existsSync(uploadPath)) await mkdirp(uploadPath);

    // Move the new uploaded image to the target path
    await move(req.file.path, targetPath, { overwrite: true });
    const user = await UserModel.findById(req.jwt.id);

    if (user.picture) {
      // Delete the previous image from the folder
      const previousImagePath = pathfs.resolve(uploadPath, user.picture);
      if (existsSync(previousImagePath)) await remove(previousImagePath);
    }

    user.picture = fileName;
    await user.save();

    return res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while uploading the file" });
  }
};
