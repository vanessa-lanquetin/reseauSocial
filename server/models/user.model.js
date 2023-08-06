const mongoose = require("mongoose");
require("validator");
const bcrypt= require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "../uploads/profil/random-user.png",
    },
    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
    likers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

//play function before save into mongoDB
// @ts-ignore
userSchema.pre("save", async function(next) {
  const salt= await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
} )

userSchema.statics.login = async function(email, password) {
  // @ts-ignore
  const user = await this.findOne({email});
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if(auth) {
      return user;
    }
    throw Error('inccroect password');
  }
  throw Error("inccroect email");
}

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

