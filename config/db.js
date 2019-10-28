const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// need something to connect to the database

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      // you get deprecationWarning in mongo if these are not used
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
