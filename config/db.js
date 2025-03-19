const mongoose = require("mongoose");
require('dotenv').config();

const mongoURI = process.env.MONGOURL;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

module.exports = mongoose.connection;