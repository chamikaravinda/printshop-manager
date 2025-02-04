import { firestore } from "../config/firebase.config.js";
import { PURCHASE_ORDER_COLLECTION } from "../utils/commonConstant.js";

const purchaseOrdersCollection = firestore.collection(PURCHASE_ORDER_COLLECTION);

class PurchaseOrder {
  constructor(purchaseOrderNumber, date, orderedBy, items, orderTotal) {
    if (
      !purchaseOrderNumber ||
      !date ||
      !orderedBy ||
      !Array.isArray(items) ||
      items.length === 0 ||
      orderTotal === undefined
    ) {
      throw new Error("Missing required fields or invalid format.");
    }

    if (
      !items.every(
        (item) =>
          item.description &&
          item.quantity &&
          item.unitPrice !== undefined &&
          item.totalPrice !== undefined
      )
    ) {
      throw new Error(
        "Each item must have a description, quantity, unit price, and totalPrice."
      );
    }

    this.purchaseOrderNumber = purchaseOrderNumber;
    this.date = date;
    this.orderedBy = orderedBy;
    this.items = items;
    this.orderTotal = orderTotal;
    this.createdAt = new Date().toISOString();
  }

  static async create(data) {
    const newPurchaseOrder = new PurchaseOrder(
      data.purchaseOrderNumber,
      data.date,
      data.orderedBy,
      data.items,
      data.orderTotal
    );
    const docRef = await purchaseOrdersCollection.add({
      purchaseOrderNumber: newPurchaseOrder.purchaseOrderNumber,
      date: newPurchaseOrder.date,
      orderedBy: newPurchaseOrder.orderedBy,
      items: newPurchaseOrder.items,
      orderTotal: newPurchaseOrder.orderTotal,
      createdAt: newPurchaseOrder.createdAt,
    });
    return { id: docRef.id, ...newPurchaseOrder };
  }

  static async getAll(filters = {}, startIndex = 0, limit = 10, order = "asc") {
    let query = purchaseOrdersCollection;

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

    if (filters.orderedBy) {
      query = query.where("orderedBy", "==", filters.orderedBy);
    }

    const snapshot = await query
      .orderBy("createdAt", order)
      .offset(startIndex)
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async getCount(filters = {}) {
    let query = purchaseOrdersCollection;

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

    if (filters.orderedBy) {
      query = query.where("orderedBy", "==", filters.orderedBy);
    }

    const snapshot = await query
      .count()
      .get();
    return snapshot.data().count;
  }

  static async getById(id) {
    const doc = await purchaseOrdersCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error("Purchase order not found.");
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    const existingDoc = await purchaseOrdersCollection.doc(id).get();
    if (!existingDoc.exists) {
      throw new Error("Purchase order not found.");
    }
    const updatedPurchaseOrder = new PurchaseOrder(
      data.purchaseOrderNumber,
      data.date,
      data.orderedBy,
      data.items,
      data.orderTotal
    );
    await purchaseOrdersCollection.doc(id).update({
      purchaseOrderNumber: updatedPurchaseOrder.purchaseOrderNumber,
      date: updatedPurchaseOrder.date,
      orderedBy: updatedPurchaseOrder.orderedBy,
      items: updatedPurchaseOrder.items,
      orderTotal: updatedPurchaseOrder.orderTotal,
      updatedAt: new Date().toISOString(),
    });
    return { id, ...updatedPurchaseOrder };
  }

  static async delete(id) {
    const docRef = purchaseOrdersCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error("Purchase order not found.");
    }
    await docRef.delete();
    return;
  }
}

export default PurchaseOrder;
