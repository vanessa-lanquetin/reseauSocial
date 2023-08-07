const UserModel = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { uploadErrors } = require("../utils/errors.utils");
const pipeline = promisify(require("stream").pipeline);

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

  const fileName = req.body.name + ".jpg";

  try {
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../../client/public/uploads/profil/${fileName}`
      )
    );
    return res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while uploading the file" });
  }
};
