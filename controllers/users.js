import User from "../models/User.js";
import Friend from "../models/Friend.js";
import CustomError from "../utils/CustomError.js";

/* READ */
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    return next(new CustomError(err.message), 404);
  }
};

export const getUserFriends = async (req, res, next) => {
  try {
    const { id } = req.params;
    let friends = await Friend.find({ user: id });

    // console.log(friends);
    const friends1 = await Promise.all(
      friends.map((ele) => User.findById(ele.friend))
    );
    friends = await Friend.find({ friend: id });
    const friends2 = await Promise.all(
      friends.map((ele) => User.findById(ele.user))
    );

    if (friends1[0] === null) friends = friends2;
    else if (friends2[0] === null) friends = friends1;
    else {
      friends = friends1.concat(friends2);
    }

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, photo }) => {
        const PicUrl = photo.secure_url;
        return { _id, firstName, lastName, occupation, location, PicUrl };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    return next(new CustomError(err.message), 404);
  }
};

/* UPDATE */

export const addRemoveFriend = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { friendId } = req.params;
    const connection1 = await Friend.find({ user: id, friend: friendId });
    const connection2 = await Friend.find({ user: friendId, friend: id });

    if (connection1.length === 0 && connection2.length === 0) {
      await Friend.create({ user: id, friend: friendId });
    } else if (connection1.length !== 0) {
      await Friend.findByIdAndDelete(connection1[0]._id);
    } else {
      await Friend.findByIdAndDelete(connection2[0]._id);
    }

    let friends = await Friend.find({ user: id });

    const friends1 = await Promise.all(
      friends.map((ele) => User.findById(ele.friend))
    );
    friends = await Friend.find({ friend: id });
    const friends2 = await Promise.all(
      friends.map((ele) => User.findById(ele.user))
    );

    if (friends1[0] === null) friends = friends2;
    else if (friends2[0] === null) friends = friends1;
    else {
      friends = friends1.concat(friends2);
    }
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, photo }) => {
        const PicUrl = photo.secure_url;
        return { _id, firstName, lastName, occupation, location, PicUrl };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    return next(new CustomError(error.message), 404);
  }
};

export const addFriend = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { friendId } = req.params;
    req.body.user = id;
    req.body.friend = friendId;
    const connection = await Friend.create(req.body);
    res.status(200).json(connection);
  } catch (error) {
    return next(new CustomError(error.message), 404);
  }
};

export const removeFriend = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { friendId } = req.params;
    const connection = await Friend.find({ user: id, friend: friendId });
    if (connection.length === 0) {
      return next(new CustomError("Not Friends"), 404);
    }
    await Friend.findByIdAndDelete(connection[0]._id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(new CustomError(error.message), 404);
  }
};
