const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.index = asyncHandler(async (req, res, next) => {
  res.render("index", { title: "Members Only" });
});

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  res.render("sign_in", { messages: req.session.messages });
});

exports.sign_in_post = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/sign_in",
  failureMessage: true,
});

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up");
});

exports.sign_up_post = [
  // Validate password fields
  body("confirm_password", "Passwords must match").custom((value, { req }) => {
    return value === req.body.password;
  }),

  // Process request after validation
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render form again with sanitized values / error messages.
      res.render("sign_up", {
        title: "Sign up",
        errors: errors.array(),
      });
      return;
    } else {
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            return next(err);
          }
          const user = new User({
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hashedPassword,
          });
          const result = await user.save();
        });

        res.redirect("/home");
      } catch (err) {
        return next(err);
      }
    }
  }),
];
