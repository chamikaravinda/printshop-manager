import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
} from "../controllers/purchase-order.controller.js";

const router = express.Router();

router.post("/", verifyToken, createPurchaseOrder);
router.get("/get", verifyToken, getAllPurchaseOrders);
router.get("/get/:id", verifyToken, getPurchaseOrderById);
router.put("/:id", verifyToken, updatePurchaseOrder);
router.delete("/:id", verifyToken, deletePurchaseOrder);

export default router;
