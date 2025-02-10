import Invoice from "../models/invoice.model.js";
import { errorHandler, successHandler } from "../utils/response.js";

export const createInvoice = async (req, res, next) => {
  console.log("Request received to create invoice", req.body);
  //TODO: Validate if the invoice number already exists
  //TODO: Validate if the purchase order number exists
  //TODO: Validate if the delivery note numbers exists
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
    };
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const order = req.query.order === "desc" ? "desc" : "asc";
    const invoices = await Invoice.getAll(filters, startIndex, limit, order);
    const recordCount = await Invoice.getCount(filters);

    res
      .status(200)
      .json(
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
