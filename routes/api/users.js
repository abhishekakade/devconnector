const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route    POST api/users
// @desc     Register user
// @access   Public

// we need to send user name, email and password to register a user
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please use a valid email").isEmail(),
    check("password", "Password should be 6 or more characters long").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if there are errors-
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Now we want to start with registration of users
      // Steps -
      // 1. See if the user exists

      let user = await User.findOne({ email });

      // if user already exists
      // 2. If the user exists, send an error because we don't want multiple registrations for same user
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists!" }] });
      }

      // 3. Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // 4. Encrypt user password using bcrypt

      const salt = await bcrypt.genSalt(10);

      // to hash the password

      user.password = await bcrypt.hash(password, salt);

      // save the user to the database

      await user.save();

      // 5. Return the jsonwentoken
      // Returning jwt is important because in the front end, when user registers,
      // we want them to get logged in right away! And we need jwt for that.
      res.send("User registered!");
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error!");
    }
  }
);

module.exports = router;
