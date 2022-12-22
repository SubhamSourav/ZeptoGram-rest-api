import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  addFriend,
  removeFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

//Add and Remove friends
router.get("/:id/:friendId", verifyToken, addFriend);
router.delete("/:id/:friendId", verifyToken, removeFriend);

export default router;
