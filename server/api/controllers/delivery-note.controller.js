import DeliveryNote from "../models/delivery-note.model.js";
import PurchaseOrder from "../models/purchase-order.model.js";
import { errorHandler, successHandler } from "../utils/response.js";

export const createDeliveryNote = async (req, res, next) => {
  console.log("Request received to create delivery note", req.body);

  try {
    const { purchaseOrderNumber, deliveryNoteNumber } = req.body;

    const [poForDeliveryNote, existingDeliveryNote] = await Promise.all([
      PurchaseOrder.getByPurchaseOrderNumber(purchaseOrderNumber),
      DeliveryNote.getByDeliveryNoteNumber(deliveryNoteNumber),
    ]);

    if (!poForDeliveryNote) {
      return next(errorHandler(400, "Purchase order not found."));
    }

    if (existingDeliveryNote) {
      return next(errorHandler(400, "Delivery note number already exists."));
    }
    
    const deliveryNote = await DeliveryNote.create(req.body);
    res
      .status(201)
      .json(
        successHandler(200, "Delivery note created successfully", deliveryNote)
      );
  } catch (error) {
    console.error("Failed to create delivery note.");
    console.error(error);
    return next(
      errorHandler(500, error.message || "Failed to create delivery note.")
    );
  }
};

export const getAllDeliveryNotes = async (req, res, next) => {
  console.log("Request received to get all delivery Notes", req.query);
  try {
    const filters = {
      date: req.query.date,
      purchaseOrderNumber: req.query.purchaseOrderNumber,
      deliveryNoteNumber: req.query.deliveryNoteNumber,
      receiver: req.query.receiver,
    };
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const order = req.query.order === "desc" ? "desc" : "asc";

    const [deliveryNotes, recordCount] = await Promise.all([
      DeliveryNote.getAll(
        filters,
        parseInt(startIndex, 10),
        parseInt(limit, 10),
        order === "desc" ? "desc" : "asc"
      ),
      DeliveryNote.getCount(filters),
    ]);

    res.status(200).json(
      successHandler(200, "Delivery notes retrieved successfully", {
        deliveryNotes,
        recordCount,
      })
    );
  } catch (error) {
    console.error("Failed to retrieve delivery notes.");
    console.error(error);
    return next(
      errorHandler(500, error.message || "Failed to retrieve delivery notes.")
    );
  }
};

export const getDeliveryNoteById = async (req, res, next) => {
  try {
    console.log("Request received to get delivery Note", req.params.id);
    const deliveryNote = await DeliveryNote.getById(req.params.id);
    res
      .status(200)
      .json(
        successHandler(200, "Delivery note retrived successfully", deliveryNote)
      );
  } catch (error) {
    console.error("Failed to get delivery note.");
    console.error(error);
    return next(
      errorHandler(404, error.message || "Failed to get delivery note.")
    );
  }
};

export const updateDeliveryNote = async (req, res, next) => {
  console.log("Request received to update delivery Note", req.params.id);
  try {
    const [poForDeliveryNote, existingDeliveryNote] = await Promise.all([
      PurchaseOrder.getByPurchaseOrderNumber(req.body.purchaseOrderNumber),
      DeliveryNote.getByDeliveryNoteNumber(req.body.deliveryNoteNumber),
    ]);

    if (!poForDeliveryNote) {
      return next(errorHandler(400, "Purchase order not found."));
    }

    if (existingDeliveryNote && existingDeliveryNote.id !== id) {
      return next(errorHandler(400, "Delivery note number already exists."));
    }

    const deliveryNote = await DeliveryNote.update(req.params.id, req.body);
    res
      .status(200)
      .json(
        successHandler(200, "Delivery note updated successfully", deliveryNote)
      );
  } catch (error) {
    console.error("Failed to update delivery note.");
    console.error(error);
    return next(
      errorHandler(404, error.message || "Failed to update delivery note.")
    );
  }
};

export const deleteDeliveryNote = async (req, res, next) => {
  console.log("Request received to delete delivery Note", req.params.id);
  try {
    await DeliveryNote.delete(req.params.id);
    res
      .status(200)
      .json(successHandler(200, "Delivery note deleted successfully"));
  } catch (error) {
    console.error("Failed to delete delivery note.");
    console.error(error);
    return next(
      errorHandler(404, error.message || "Failed to delete delivery note.")
    );
  }
};
