const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation
} = require("../middlewares/validations");

router.get("/all", (req, res, next) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(400).json("Error: " + err);
    });
});

router.post("/register", async (req, res, next) => {
  // validate the data before we a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // Checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json("Email already exists");

  // HASH passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    // Create a new user
    User.create({ ...req.body, password: hashedPassword })
      .then(user => {
        res.json(user._id);
      })
      .catch(err => {
        res.status(400).json("Error: " + err);
      });
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.post("/login", async (req, res, next) => {
  // validate the data before we a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  // Checking if the user is exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json("Email or password is incorrect");

  // PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json("Email or Password is incorrect");

  // Create and assign a token
  const token = jwt.sign({ __id: user.__id }, process.env.TOKEN_SECRET);

  try {
    res.header("auth-token", token).json(token);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
