import { firestore } from "../config/firebase.config.js";
import { INVOICE_COLLECTION } from "../utils/commonConstant.js";

const invoicesCollection = firestore.collection(INVOICE_COLLECTION);

class Invoice {
  constructor(purchaseOrderNumber, date, receiver, items, totalAmount) {
    if (
      !purchaseOrderNumber ||
      !date ||
      !receiver ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount
    ) {
      throw new Error("Missing required fields or invalid items format.");
    }

    if (
      !items.every(
        (item) =>
          item.description &&
          item.quantity &&
          item.unitPrice &&
          item.price 
      )
    ) {
      throw new Error(
        "Each item must have a description, quantity, unit price, and price."
      );
    }

    this.purchaseOrderNumber = purchaseOrderNumber;
    this.date = date;
    this.receiver = receiver;
    this.items = items;
    this.totalAmount = totalAmount;
    this.createdAt = new Date().toISOString();
  }

  static async create(data) {
    const newInvoice = new Invoice(
      data.purchaseOrderNumber,
      data.date,
      data.receiver,
      data.items,
      data.totalAmount
    );
    const docRef = await invoicesCollection.add({
      purchaseOrderNumber: newInvoice.purchaseOrderNumber,
      date: newInvoice.date,
      receiver: newInvoice.receiver,
      items: newInvoice.items,
      totalAmount: newInvoice.totalAmount,
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

    if (filters.receiver) {
      query = query.where("receiver", "==", filters.receiver);
    }

    const snapshot = await query
      .orderBy("createdAt", order)
      .offset(startIndex)
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await invoicesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error("Invoice not found.");
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    const existingDoc = await invoicesCollection.doc(id).get();
    if (!existingDoc.exists) {
      throw new Error("Invoice not found.");
    }
    const updatedInvoice = new Invoice(
      data.purchaseOrderNumber,
      data.date,
      data.receiver,
      data.items,
      data.totalAmount
    );
    await invoicesCollection.doc(id).update({
      purchaseOrderNumber: updatedInvoice.purchaseOrderNumber,
      date: updatedInvoice.date,
      receiver: updatedInvoice.receiver,
      items: updatedInvoice.items,
      totalAmount: updatedInvoice.totalAmount,
      updatedAt: new Date().toISOString(),
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
