const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { move, existsSync, mkdirp, remove } = require("fs-extra");
const pathfs = require("path");
const { promisify } = require("util");
const { log } = require("console");
const pipeline = promisify(require("stream").pipeline);

module.exports.readPost = async (req, res) => {
  try {
    const docs = await PostModel.find();
    res.send(docs).sort({ createdAt: -1 });
  } catch (err) {
    console.log("erreur pour récupérer les données : " + err);
  }
};

module.exports.createPost = async (req, res) => {
  let fileName;

  if (req.file !== null) {
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

    const fileName = req.body.posterId + Date.now() + ".jpg";

    try {
      const uploadPath = pathfs.resolve(
        __dirname,
        "..",
        "client",
        "public",
        "uploads",
        "posts"
      );
      const targetPath = pathfs.resolve(uploadPath, fileName);
      if (!existsSync(uploadPath)) await mkdirp(uploadPath);
      await move(req.file.path, targetPath, { overwrite: true });
      const newPost = new PostModel({
        posterId: req.jwt.id,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts/" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
      });
      try {
        const post = await newPost.save();
        return res.status(201).json(post);
      } catch (err) {
        return res.status(400).send(err);
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while uploading the file" });
    }
  }
};

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  try {
    const docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    ).exec();
    res.send(docs);
  } catch (err) {
    console.log("update error: " + err);
  }
};

module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
  try {
    const docs = await PostModel.findByIdAndRemove(req.params.id).exec();
    res.send(docs);
  } catch (err) {
    console.log(" Delete error" + err);
  }
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  try {
    const post = await PostModel.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const userId = req.body.id;

    if (post.likers.includes(userId)) {
      return res.status(400).send("You already liked this post");
    }

    post.likers.push(userId);
    const updatedPost = await post.save();

    const user = await UserModel.findOne({ _id: userId });
    if (user) {
      user.likes.push(req.params.id);
      await user.save();
      res.send(updatedPost);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  try {
    const post = await PostModel.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const userId = req.body.id;
    if (!post.likers.includes(userId)) {
      return res.status(400).send("You haven't liked this post");
    }
    post.likers.pull(userId);
    const updatedPost = await post.save();
    const user = await UserModel.findOne({ _id: userId });
    if (user) {
      user.likes = user.likes.filter((like) => like !== req.params.id);
      await user.save();
      res.send(updatedPost);
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  // Vérifiez si commenterPseudo existe dans req.body
  if (!req.body.commenterPseudo)
    return res.status(400).send("commenterPseudo is required");

  try {
    const docs = await PostModel.findOneAndUpdate(
      { _id: req.params.id }, // Utilisez un objet pour spécifier la condition de recherche
      {
        $push: {
          comments: {
            _id: new ObjectID(),
            commenterId: req.jwt.id,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );
    return res.send(docs);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);

  try {
    const docs = await PostModel.findById(req.params.id);
    if (!docs) return res.status(400).send("Post not exists");
    const theComment = docs.comments.find((comment) =>
      comment._id?.equals(req.body.commentId)
    );
    if (!theComment) return res.status(404).send("comment not found");
    if (theComment.commenterId !== req.jwt.id)
      return res.status(403).send("Not Authorized");
    theComment.text = req.body.text;
    await docs.save();
    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
  try {
    const postId = req.params.id;
    const commentId = req.body.commentId;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    post.comments.pull(commentId);
    const updatedPost = await post.save();
    return res.json(updatedPost);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};
