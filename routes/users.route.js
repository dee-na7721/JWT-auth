//Handling User Routes
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(3).max(255).required(),
});

router.post("/", async (req, res) => {
  //validate the request body first
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  console.log("heyyyyy");
  const token = user.generateAuthToken();
  console.log(token);
  //access token header ma gayena tesaile res.send ma gardiyeko
  res.header("x-auth-token", token).send({
    _id: user.id,
    name: user.name,
    email: user.email,
    acessToken: token,
  });
});

module.exports = router;
