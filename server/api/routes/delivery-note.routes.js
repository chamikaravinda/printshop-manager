import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDeliveryNote,
  deleteDeliveryNote,
  getAllDeliveryNotes,
  getDeliveryNoteById,
  updateDeliveryNote,
} from "../controllers/delivery-note.controller.js";

const router = express.Router();

router.post("/", verifyToken, createDeliveryNote);
router.get("/get", verifyToken, getAllDeliveryNotes);
router.get("/get/:id", verifyToken, getDeliveryNoteById);
router.put("/:id", verifyToken, updateDeliveryNote);
router.delete("/:id", verifyToken, deleteDeliveryNote);

export default router;
