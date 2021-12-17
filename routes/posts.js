const express = require("express");
const {
  createPost,
  updatPost,
  deletePost,
  likePost,
  timeLine,
  getPost,
  getUserPosts,
} = require("../controllers/post");
const router = express.Router();
const Post = require("../models/Post");

//create post
router.post("/", createPost);

//update posts
router.put("/:id", updatPost);

//delete post
router.delete("/:id", deletePost);

//like a post
router.put("/:id/like", likePost);

//get a post
router.get("/:id", getPost);

//get timeline posts
router.get("/timeline/:userid", timeLine);

router.get("/profile/:username", getUserPosts);

module.exports = router;
