const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = async (req, res) => {
  try {
    const docs = await PostModel.find();
    res.send(docs).sort({ createdAt: -1 });
  } catch (err) {
    console.log("erreur pour récupérer les données : " + err);
  }
};

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
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
            commenterId: req.body.commenterId,
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
    const docs = await PostModel.findById(
      { _id: req.params.id },
      (err, docs) => {
        const theComment = docs.comments.find((comment) => {
          comment._id.equals(req.body.commentId);
        });
        if (!theComment) return res.status(404).send("comment not found");
        theComment.text = req.body.text;
        return docs.save((err) => {
          return res.status(200).send(docs);
        });
      }
    );
    return res.send(docs);
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown " + req.params.id);
};
