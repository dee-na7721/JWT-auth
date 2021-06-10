const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi"); //schema desc language and data validator for JS
const mongoose = require("mongoose");

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
    config.get("privatekey")
  ); //get the private key from the config file -> environment variable
  return token;
};

//Creating a user model
const User = mongoose.model("User", UserSchema);

//function to validate user
function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
  };

  return Joi.validate(user, schema);
}

//exporting user model and validateUser func
exports.User = User;
exports.validate = validateUser;
