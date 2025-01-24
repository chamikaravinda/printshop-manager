import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/", verifyToken, createInvoice);
router.get("/get", verifyToken, getAllInvoices);
router.get("/get/:id", verifyToken, getInvoiceById);
router.put("/:id", verifyToken, updateInvoice);
router.delete("/:id", verifyToken, deleteInvoice);

export default router;
