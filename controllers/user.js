const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.updateUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        console.log("err", err.message);
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account Has Been Updated");
    } catch (err) {
      console.log("err", err.message);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You Can Update Only Your Account" });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Has Been Deleted");
    } catch (err) {
      console.log("err", err.message);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You Can Update Only Your Account" });
  }
};

//GET user
// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, updatedAt, ...other } = user._doc;
//     console.log(user._doc);
//     res.status(200).json(other);
//   } catch (err) {
//     console.log("err", err.message);
//     res.status(500).json(err);
//   }
// };

// GET user
exports.getUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    console.log("err", err.message);
    res.status(500).json(err);
  }
};

//FOLOW & UNFOLLOW
exports.followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.body.userId } });
        res.status(200).json("User has Been Followed");
      } else {
        res.status(403).json("You already follow this year");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

//GET FRIENDS
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//UNFOLLOW
exports.unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been Unfollowed");
      } else {
        res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      console.log("err", err.message);
      res.status(500).json(err);
    }
  } else {
    console.log("err", err.message);
    res.status(403).json("You Cant Unfollow Yourself");
  }
};
