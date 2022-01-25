import express from "express";
import Posts from "../models/Posts.js";

const router = express.Router();

//create a post
router.post("/", async (req, res) => {
  const newPost = new Posts(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json("Error");
  }
});

//update a post
//delete a post
//like a post
//get a post
//get timeline post

export default router;
