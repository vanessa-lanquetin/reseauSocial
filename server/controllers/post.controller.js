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
    const docs = await PostModel.find().sort({ createdAt: -1 }); // Correction : tri des documents par date de création
    res.send(docs);
  } catch (err) {
    console.log("Erreur lors de la récupération des données : " + err);
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
      ) {
        throw new Error("Fichier non valide");
      }

      if (req.file.size > 500000) {
        throw new Error("Taille maximale dépassée");
      }
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(400).json({ errors });
    }

    const fileName = req.body.posterId + Date.now() + ".jpg";

    try {
      const uploadPath = pathfs.resolve(
        __dirname,
        "..",
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
        .json({ error: "Une erreur s'est produite lors du téléchargement du fichier" });
    }
  }
};

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

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
    console.log("Erreur de mise à jour : " + err);
  }
};

module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);
  try {
    const docs = await PostModel.findByIdAndRemove(req.params.id).exec();
    res.send(docs);
  } catch (err) {
    console.log("Erreur lors de la suppression : " + err);
  }
};

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    const post = await PostModel.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).send("Publication introuvable");
    }

    const userId = req.body.id;

    if (post.likers.includes(userId)) {
      return res.status(400).send("Vous avez déjà aimé cette publication");
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
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    const post = await PostModel.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).send("Publication introuvable");
    }
    const userId = req.body.id;
    if (!post.likers.includes(userId)) {
      return res.status(400).send("Vous n'avez pas aimé cette publication");
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
    return res.status(400).send("ID inconnu : " + req.params.id);

  // Vérifiez si commenterPseudo existe dans req.body
  if (!req.body.commenterPseudo)
    return res.status(400).send("commenterPseudo est requis");

  try {
    const docs = await PostModel.findOneAndUpdate(
      { _id: req.params.id }, 
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
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    const docs = await PostModel.findById(req.params.id);
    if (!docs) return res.status(400).send("La publication n'existe pas");
    const theComment = docs.comments.find((comment) =>
      comment._id?.equals(req.body.commentId)
    );
    if (!theComment) return res.status(404).send("Commentaire introuvable");
    if (theComment.commenterId !== req.jwt.id)
      return res.status(403).send("Non autorisé");
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
    return res.status(400).send("ID inconnu : " + req.params.id);
  try {
    const postId = req.params.id;
    const commentId = req.body.commentId;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Publication introuvable");
    }
    post.comments.pull(commentId);
    const updatedPost = await post.save();
    return res.json(updatedPost);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};
