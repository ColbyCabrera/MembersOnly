const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");

// names visible to members Only

exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({}).populate("sender");
  console.log(req.user);
  res.render("index", {
    title: "Members Only",
    messages: messages,
    user: req.user,
  });
});

exports.sign_in_get = asyncHandler(async (req, res, next) => {
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

        res.redirect("/sign_in");
      } catch (err) {
        return next(err);
      }
    }
  }),
];

exports.logout_get = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/home");
  });
});

exports.secret_get = asyncHandler(async (req, res, next) => {
  res.render("secret", { user: req.user });
});

exports.secret_post = [
  // Validate password fields REPLACE WITH ENV VARIABLE
  body("password", "Wrong password").custom((value, { req }) => {
    return value == "password";
  }),

  // Process request after validation
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty() || req.user == undefined) {
      // There are errors, render form again with sanitized values / error messages.
      res.render("secret", {
        title: "Secret password",
        errors: errors.array(),
      });
      return;
    } else {
      try {
        req.user.isMember = true;
        const result = await User.findByIdAndUpdate(req.user._id, req.user, {});
        res.redirect("/home");
      } catch (err) {
        return next(err);
      }
    }
  }),
];

exports.messages_create_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({});
  res.render("create_message", { messages: messages });
});

exports.messages_create_post = asyncHandler(async (req, res, next) => {
  const message = new Message({
    title: req.body.title,
    text: req.body.text,
    sender: req.user._id,
  });
  const result = await message.save();
  res.redirect("/home");
});

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/home");
});
