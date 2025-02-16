import dayjs from "dayjs";
import { firestore } from "../config/firebase.config.js";
import { INVOICE_COLLECTION } from "../utils/commonConstant.js";

const invoicesCollection = firestore.collection(INVOICE_COLLECTION);

class Invoice {
  constructor(
    purchaseOrderNumber,
    invoiceNumber,
    date,
    receiver,
    items,
    totalAmount,
    deliveryNotes,
    paid
  ) {
    if (
      !purchaseOrderNumber ||
      !invoiceNumber ||
      !date ||
      !receiver ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalAmount === undefined ||
      !Array.isArray(deliveryNotes) ||
      deliveryNotes.length === 0 ||
      !typeof paid === "boolean"
    ) {
      throw new Error("Missing required fields or invalid format.");
    }

    if (
      !items.every(
        (item) =>
          item.description && item.quantity && item.unitPrice && item.totalPrice
      )
    ) {
      throw new Error(
        "Each item must have a description, quantity, unit price, and total price."
      );
    }

    this.purchaseOrderNumber = purchaseOrderNumber;
    this.invoiceNumber = invoiceNumber;
    this.date = date;
    this.receiver = receiver;
    this.items = items;
    this.totalAmount = totalAmount;
    this.deliveryNotes = deliveryNotes;
    this.createdAt = new Date().toISOString();
    this.paid = paid;
  }

  static async create(data) {
    const newInvoice = new Invoice(
      data.purchaseOrderNumber,
      data.invoiceNumber,
      data.date,
      data.receiver,
      data.items,
      data.totalAmount,
      data.deliveryNotes,
      data.paid
    );
    const docRef = await invoicesCollection.add({
      purchaseOrderNumber: newInvoice.purchaseOrderNumber,
      invoiceNumber: newInvoice.invoiceNumber,
      date: newInvoice.date,
      receiver: newInvoice.receiver,
      items: newInvoice.items,
      totalAmount: newInvoice.totalAmount,
      deliveryNotes: newInvoice.deliveryNotes,
      paid: newInvoice.paid,
      createdAt: newInvoice.createdAt,
    });
    return { id: docRef.id, ...newInvoice };
  }

  static async getAll(filters = {}, startIndex = 0, limit = 10, order = "asc") {
    let query = invoicesCollection;

    if (filters.date) {
      query = query.where("date", "==", filters.date);
    }

    if (filters.purchaseOrderNumber) {
      query = query.where(
        "purchaseOrderNumber",
        "==",
        filters.purchaseOrderNumber
      );
    }

    if (filters.invoiceNumber) {
      query = query.where("invoiceNumber", "==", filters.invoiceNumber);
    }

    if (filters.receiver) {
      query = query.where("receiver", "==", filters.receiver);
    }

    if (filters.paid) {
      query = query.where("paid", "==", JSON.parse(filters.paid));
    }

    if (Object.keys(filters).length === 0) {
      query = query.orderBy("createdAt", order);
    }

    const snapshot = await query.offset(startIndex).limit(limit).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async getCount(filters = {}) {
    let query = invoicesCollection;

    if (filters.date) {
      query = query.where("date", "==", filters.date);
    }

    if (filters.purchaseOrderNumber) {
      query = query.where(
        "purchaseOrderNumber",
        "==",
        filters.purchaseOrderNumber
      );
    }

    if (filters.invoiceNumber) {
      query = query.where("invoiceNumber", "==", filters.invoiceNumber);
    }

    if (filters.receiver) {
      query = query.where("receiver", "==", filters.receiver);
    }

    if (filters.paid) {
      query = query.where("paid", "==", JSON.parse(filters.paid));
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  }

  static async getById(id) {
    const doc = await invoicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error("Invoice not found.");
    }
    return { id: doc.id, ...doc.data() };
  }

  static async getByInvoiceNumber(invoiceNumber) {
    const snapshot = await invoicesCollection
      .where("invoiceNumber", "==", invoiceNumber)
      .get();

    if (snapshot.empty) {
      return;
    }

    const doc = snapshot.docs[0];

    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    const existingDoc = await invoicesCollection.doc(id).get();
    if (!existingDoc.exists) {
      throw new Error("Invoice not found.");
    }
    const updatedInvoice = new Invoice(
      data.purchaseOrderNumber,
      data.invoiceNumber,
      data.date,
      data.receiver,
      data.items,
      data.totalAmount,
      data.deliveryNotes,
      data.paid
    );
    await invoicesCollection.doc(id).update({
      purchaseOrderNumber: updatedInvoice.purchaseOrderNumber,
      invoiceNumber: updatedInvoice.invoiceNumber,
      date: updatedInvoice.date,
      receiver: updatedInvoice.receiver,
      items: updatedInvoice.items,
      totalAmount: updatedInvoice.totalAmount,
      deliveryNotes: updatedInvoice.deliveryNotes,
      updatedAt: new Date().toISOString(),
      paid: updatedInvoice.paid,
    });
    return { id, ...updatedInvoice };
  }

  static async delete(id) {
    const docRef = invoicesCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error("Invoice not found.");
    }
    await docRef.delete();
    return;
  }
}

export default Invoice;
