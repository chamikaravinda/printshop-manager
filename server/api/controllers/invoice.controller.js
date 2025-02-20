import DeliveryNote from "../models/delivery-note.model.js";
import Invoice from "../models/invoice.model.js";
import PurchaseOrder from "../models/purchase-order.model.js";
import { errorHandler, successHandler } from "../utils/response.js";

export const createInvoice = async (req, res, next) => {
  console.log("Request received to create invoice", req.body);

  const [existingInvoice, poForInvoice, notes] = await Promise.all([
    Invoice.getByInvoiceNumber(req.body.invoiceNumber),
    PurchaseOrder.getByPurchaseOrderNumber(req.body.purchaseOrderNumber),
    Promise.all(
      req.body.deliveryNotes.map(DeliveryNote.getByDeliveryNoteNumber)
    ),
  ]);

  if (existingInvoice)
    return next(errorHandler(400, "Invoice number already exists."));
  if (!poForInvoice)
    return next(errorHandler(400, "Purchase order not found."));
  if (notes.some((note) => !note))
    return next(errorHandler(400, "Contain invalid delivery note number."));

  //TODO: Check if the delivery note numbers not include in another invoice
  try {
    const invoice = await Invoice.create(req.body);
    res
      .status(201)
      .json(successHandler(200, "Invoice created successfully", invoice));
  } catch (error) {
    console.error("Failed to create invoice.");
    console.error(error);
    return next(
      errorHandler(500, error.message || "Failed to create invoice.")
    );
  }
};

export const getAllInvoices = async (req, res, next) => {
  console.log("Request received to get all invoices", req.query);
  try {
    const filters = {
      date: req.query.date,
      purchaseOrderNumber: req.query.purchaseOrderNumber,
      invoiceNumber: req.query.invoiceNumber,
      receiver: req.query.receiver,
      paid: req.query.paid,
    };
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const order = req.query.order === "desc" ? "desc" : "asc";

    const [invoices, recordCount] = await Promise.all([
      Invoice.getAll(filters, startIndex, limit, order),
      Invoice.getCount(filters),
    ]);

    res.status(200).json(
      successHandler(200, "Invoices retrieved successfully", {
        invoices,
        recordCount,
      })
    );
  } catch (error) {
    console.error("Failed to retrieve invoices.");
    console.error(error);
    return next(
      errorHandler(500, error.message || "Failed to retrieve invoices.")
    );
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    console.log("Request received to get invoice", req.params.id);
    const invoice = await Invoice.getById(req.params.id);
    res
      .status(200)
      .json(successHandler(200, "Invoice retrieved successfully", invoice));
  } catch (error) {
    console.error("Failed to get invoice.");
    console.error(error);
    return next(errorHandler(404, error.message || "Failed to get invoice."));
  }
};

export const updateInvoice = async (req, res, next) => {
  console.log("Request received to update invoice", req.params.id);
  try {
    const [existingInvoice, poForInvoice, notes] = await Promise.all([
      req.body.invoiceNumber
        ? Invoice.getByInvoiceNumber(req.body.invoiceNumber)
        : null,
      PurchaseOrder.getByPurchaseOrderNumber(req.body.purchaseOrderNumber),
      req.body.deliveryNotes
        ? Promise.all(
            req.body.deliveryNotes.map(DeliveryNote.getByDeliveryNoteNumber)
          )
        : [],
    ]);

    if (existingInvoice && existingInvoice.id !== req.params.id)
      return next(errorHandler(400, "Invoice number already exists."));
    if (!poForInvoice)
      return next(errorHandler(400, "Purchase order not found."));
    if (notes.some((note) => !note))
      return next(errorHandler(400, "Contain invalid delivery note number."));

    const invoice = await Invoice.update(req.params.id, req.body);
    res
      .status(200)
      .json(successHandler(200, "Invoice updated successfully", invoice));
  } catch (error) {
    console.error("Failed to update invoice.");
    console.error(error);
    return next(
      errorHandler(404, error.message || "Failed to update invoice.")
    );
  }
};

export const deleteInvoice = async (req, res, next) => {
  console.log("Request received to delete invoice", req.params.id);
  try {
    await Invoice.delete(req.params.id);
    res.status(200).json(successHandler(200, "Invoice deleted successfully"));
  } catch (error) {
    console.error("Failed to delete invoice.");
    console.error(error);
    return next(
      errorHandler(404, error.message || "Failed to delete invoice.")
    );
  }
};
