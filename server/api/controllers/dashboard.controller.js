import { parse } from "date-fns";
import Invoice from "../models/invoice.model.js";
import { errorHandler, successHandler } from "../utils/response.js";
import { differenceInDays } from "date-fns";

export const getDasahboardDetails = async (req, res, next) => {
  console.log("Request received to get dashboard details", req.query);
  try {
    const filters = {
      paid: "false",
    };

    const recordCount = await Invoice.getCount(filters);
    const invoices = await Invoice.getAll(filters, 0, recordCount);

    let unpaidTotal = 0;
    let overdueTotal = 0;

    invoices.forEach((invoice) => {
      if (calculateDateDifference(invoice.date) < 30) {
        unpaidTotal += invoice.totalAmount;
      } else {
        overdueTotal += invoice.totalAmount;
      }
    });

    res.status(200).json(
      successHandler(200, "Dashboard detail retrieved successfully", {
        unpaidTotal,
        overdueTotal,
        unpaidInvoices: recordCount,
      })
    );
  } catch (error) {
    console.error("Failed to retrieve dashboard detail");
    console.error(error);
    return next(
      errorHandler(500, error.message || "Failed to dashboard detail")
    );
  }
};

const calculateDateDifference = (date) => {
  date = parse(date, "dd/MM/yyyy", new Date());
  return differenceInDays(new Date(), date);
};
