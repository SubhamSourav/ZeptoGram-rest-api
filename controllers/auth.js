import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cookieToken from "../utils/cookieToken.js";
import CustomError from "../utils/CustomError.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const user = await User.findOne({ email: email });

    if (user) return res.status(400).json({ msg: "User Already exist. " });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
