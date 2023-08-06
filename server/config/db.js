
  const mongoose = require("mongoose");

  mongoose
    .connect(process.env.MONGODB_URL || '')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Not Connected to MongoDB", err));
