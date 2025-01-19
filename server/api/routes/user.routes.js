import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  updateUserById,
  deleteUser,
  signout,
  getUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, updateUserById);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/get", verifyToken, getUsers);

export default router;
