import bcrypt from "bcrypt";
import User from "../models/User.js";
import cookieToken from "../utils/cookieToken.js";
import CustomError from "../utils/CustomError.js";
import cloudinary from "cloudinary";

/* REGISTER USER */
export const register = async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("Photo is required for signup", 400));
  }

  console.log(req.files);

  let file = req.files;
  const result = await cloudinary.v2.uploader.upload(
    file.picture.tempFilePath,
    {
      folder: "SocialMediaUsers",
      width: 150,
      crop: "scale",
    }
  );

  try {
    const { firstName, lastName, email, password, location, occupation } =
      req.body;

    const user = await User.findOne({ email: email });

    if (user) return res.status(400).json({ msg: "User Already exist. " });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      location,
      occupation,
      photo: {
        id: result.public_id,
        secure_url: result.secure_url,
      },
    });
    const savedUser = await newUser.save();
    // console.log(savedUser);
    return res.status(201).json(savedUser);
  } catch (error) {
    await cloudinary.v2.uploader.destroy(result.public_id);
    return next(new CustomError(error.message, 400));
  }
};

/* LOGGING IN */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const ispassword = await user.isValidatedPassword(password);

    //if password dont match
    if (!ispassword) {
      return res.status(400).json({ msg: "Wrong Password. " });
    }

    //if all goes good we will send the token
    cookieToken(user, res, "Successfully logged-In");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.Error });
  }
};

/* LOGGING OUT */

export const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.Error });
  }
};
