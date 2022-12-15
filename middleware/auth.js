import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    console.log(req.cookies);
    let token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    console.log(decoded);
    return next();
  } catch (error) {
    return next(new CustomError(error.message), 500);
  }
};
