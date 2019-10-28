const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator/check");

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
  (req, res) => {
    const errors = validationResult(req);

    // if there are errors-
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    res.send("User route");
  }
);

module.exports = router;
