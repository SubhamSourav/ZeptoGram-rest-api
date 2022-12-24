import Post from "../models/Post.js";
import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import cloudinary from "cloudinary";

/* CREATE */
export const createPost = async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("Photo Not Present", 400));
  }

  let file = req.files;
  const result = await cloudinary.v2.uploader.upload(
    file.picture.tempFilePath,
    {
      folder: "Posts",
    }
  );

  try {
    const { description } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicture: user.photo.secure_url,
      photo: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
      likes: {},
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    return next(new CustomError(err.message), 409);
  }
};

/* READ */
export const getFeedPosts = async (req, res, next) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    return next(new CustomError(err.message), 404);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    return next(new CustomError(err.message), 404);
  }
};

/* UPDATE */
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    return next(new CustomError(err.message), 404);
  }
};
