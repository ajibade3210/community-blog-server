const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { registerUser, loginUsers } = require("../controllers/auth");

//Register user
router.post("/register", registerUser);

//Login
router.post("/login", loginUsers);

module.exports = router;
