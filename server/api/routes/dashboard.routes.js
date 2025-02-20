import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getDasahboardDetails } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", verifyToken, getDasahboardDetails);

export default router;
