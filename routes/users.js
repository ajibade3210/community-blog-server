const express = require("express");
const router = express.Router();
const {
  updateUser,
  getUser,
  deleteUser,
  followUser,
  getFriends,
  unfollowUser,
} = require("../controllers/user");
const User = require("../models/User");

//Update User
router.put("/:id", updateUser);

//Delete User
router.delete("/:id", deleteUser);

//Get User
router.get("/", getUser);

//get Friends
router.get("/friends/:userId", getFriends);

//follow
router.put("/:id/follow", followUser);

//Unfollow User
router.put("/:id/unfollow", unfollowUser);

module.exports = router;
