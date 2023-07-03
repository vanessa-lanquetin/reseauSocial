
  const mongoose = require("mongoose");

  mongoose
    .connect("mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.iwy0j8f.mongodb.net/test")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Not Connected to MongoDB", err));
