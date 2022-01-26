import express from "express";
import Posts from "../models/Posts.js";
import Users from "../models/Users.js";

const router = express.Router();

//create a post
router.post("/", async (req, res) => {
  const newPost = await new Posts(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json("Error");
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post have been updated.");
    } else {
      res.status(403).json("You can update only your post.");
    }
  } catch (err) {
    res.status(500).json("Error");
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("The post have been deleted.");
    } else {
      res.status(403).json("You can delete only your post.");
    }
  } catch (err) {
    res.status(500).json("Error");
  }
});

//like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post had been disliked.");
    }
  } catch (err) {
    res.status(500).json("Error");
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json("Error");
  }
});

//get timeline post
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await Users.findById(req.body.userId);
    const userPosts = await Posts.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Posts.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
