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

exports.sign_up = asyncHandler(async (req, res, next) => {
  console.log("here");
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