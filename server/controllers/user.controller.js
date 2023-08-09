const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id Unknow: " + req.params.id);

  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (user) {
      res.send(user);
    } else {
      console.log("Id unknown: " + req.params.id);
    }
  } catch (err) {
    console.log("Id unknown: " + err);
  }
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id Unknow: " + req.params.id);

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      return res.status(500).send({ message: "User not found" });
    }
  } catch (err) {
    console.log("Error updating user: " + err);
    return res.status(500).send({ message: err });
  }
};

module.exports.deleteUser= async(req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Id Unknow: " + req.params.id); 
    
    try{
      await UserModel.findOneAndRemove({_id: req.params.id}).exec();
      res.status(200).json({
        message:"Succesfully deleted"
      });
    }
    catch(err){
      return res.status(500).send({ message: err });
    }
}

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("Id Unknow: " + req.params.id);

  try {
    // Ajouter à la liste des abonnés
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true }
    );

    if (user) {
      // Ajouter à la liste des abonnements
      await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } },
        { new: true, upsert: true }
      );

      res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log("Error following user: " + err);
    return res.status(500).send({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnFollow)
  )
    return res.status(400).send("Id Unknow: " + req.params.id);

  try {
    // Ajouter à la liste des abonnés
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnFollow } },
      { new: true, upsert: true }
    );

    if (user) {
      // Ajouter à la liste des abonnements
      await UserModel.findByIdAndUpdate(
        req.body.idToUnFollow,
        { $pull: { followers: req.params.id } },
        { new: true, upsert: true }
      );

      res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log("Error following user: " + err);
    return res.status(500).send({ message: err });
  }
};
