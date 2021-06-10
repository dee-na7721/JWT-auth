const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi"); //schema desc language and data validator for JS
const mongoose = require("mongoose");
const { connect } = require("../routes/users.route");

// simple Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 3,
  },
  isAdmin: Boolean,
});

//custom method to generate authToken
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("myprivatekey")
  );
  console.log(token);
  //get the private key from the config file -> environment variable
  return token;
};

//exporting a user model
module.exports = mongoose.model("User", UserSchema);
