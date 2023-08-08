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
  res.render("sign_in", {messages: req.session.messages});
});

exports.sign_in_post = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/sign_in",
  failureMessage: true,
});


exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up");
});

exports.sign_up_post = asyncHandler(async (req, res, next) => {
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
});