import PurchaseOrder from "../models/purchase-order.model.js";
import { errorHandler, successHandler } from "../utils/response.js";

export const createPurchaseOrder = async (req, res, next) => {
  console.log("Request received to create purchase order", req.body);

  try {
    const purchaseOrder = await PurchaseOrder.create(req.body);
    res
      .status(201)
      .json(
        successHandler(201, "Purchase order created successfully", purchaseOrder)
      );
  } catch (error) {
    console.error("Failed to create purchase order.", error);
    return next(
      errorHandler(500, error.message || "Failed to create purchase order.")
    );
  }
};

export const getAllPurchaseOrders = async (req, res, next) => {
  console.log("Request received to get all purchase orders", req.query);
  try {
    const filters = {
      date: req.query.date,
      purchaseOrderNumber: req.query.purchaseOrderNumber,
      receiver: req.query.receiver,
    };
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const order = req.query.order === "desc" ? "desc" : "asc";
    const purchaseOrders = await PurchaseOrder.getAll(
      filters,
      startIndex,
      limit,
      order
    );
    res
      .status(200)
      .json(
        successHandler(
          200,
          "Purchase orders retrieved successfully",
          purchaseOrders
        )
      );
  } catch (error) {
    console.error("Failed to retrieve purchase orders.", error);
    return next(
      errorHandler(500, error.message || "Failed to retrieve purchase orders.")
    );
  }
};

export const getPurchaseOrderById = async (req, res, next) => {
  try {
    console.log("Request received to get purchase order", req.params.id);
    const purchaseOrder = await PurchaseOrder.getById(req.params.id);
    res
      .status(200)
      .json(
        successHandler(200, "Purchase order retrieved successfully", purchaseOrder)
      );
  } catch (error) {
    console.error("Failed to get purchase order.", error);
    return next(
      errorHandler(404, error.message || "Failed to get purchase order.")
    );
  }
};

export const updatePurchaseOrder = async (req, res, next) => {
  console.log("Request received to update purchase order", req.params.id);
  try {
    const purchaseOrder = await PurchaseOrder.update(req.params.id, req.body);
    res
      .status(200)
      .json(
        successHandler(200, "Purchase order updated successfully", purchaseOrder)
      );
  } catch (error) {
    console.error("Failed to update purchase order.", error);
    return next(
      errorHandler(404, error.message || "Failed to update purchase order.")
    );
  }
};

export const deletePurchaseOrder = async (req, res, next) => {
  console.log("Request received to delete purchase order", req.params.id);
  try {
    await PurchaseOrder.delete(req.params.id);
    res
      .status(200)
      .json(successHandler(200, "Purchase order deleted successfully"));
  } catch (error) {
    console.error("Failed to delete purchase order.", error);
    return next(
      errorHandler(404, error.message || "Failed to delete purchase order.")
    );
  }
};
