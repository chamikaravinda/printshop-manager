import { firestore } from "../config/firebase.config.js";
import { DELIVERY_NOTE_COLLECTION } from "../utils/commonConstant.js";

const deliveryNotesCollection = firestore.collection(DELIVERY_NOTE_COLLECTION);

class DeliveryNote {
  constructor(purchaseOrderNumber, date, receiver, items) {
    if (
      !purchaseOrderNumber ||
      !date ||
      !receiver ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error("Missing required fields or invalid items format.");
    }

    if (!items.every((item) => item.description && item.quantity)) {
      throw new Error("Each item must have a description and quantity.");
    }

    this.purchaseOrderNumber = purchaseOrderNumber;
    this.date = date;
    this.receiver = receiver;
    this.items = items;
    this.createdAt = new Date().toISOString();
  }

  static async create(data) {
    const newDeliveryNote = new DeliveryNote(
      data.purchaseOrderNumber,
      data.date,
      data.receiver,
      data.items
    );
    const docRef = await deliveryNotesCollection.add({
      purchaseOrderNumber: newDeliveryNote.purchaseOrderNumber,
      date: newDeliveryNote.date,
      receiver: newDeliveryNote.receiver,
      items: newDeliveryNote.items,
      createdAt: newDeliveryNote.createdAt,
    });
    return { id: docRef.id, ...newDeliveryNote };
  }

  static async getAll(filters = {}, startIndex = 0, limit = 10, order = "asc") {
    let query = deliveryNotesCollection;

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
    const doc = await deliveryNotesCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error("Delivery note not found.");
    }
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    const existingDoc = await deliveryNotesCollection.doc(id).get();
    if (!existingDoc.exists) {
      throw new Error("Delivery note not found.");
    }
    const updatedDeliveryNote = new DeliveryNote(
      data.purchaseOrderNumber,
      data.date,
      data.receiver,
      data.items
    );
    await deliveryNotesCollection.doc(id).update({
      purchaseOrderNumber: updatedDeliveryNote.purchaseOrderNumber,
      date: updatedDeliveryNote.date,
      receiver: updatedDeliveryNote.receiver,
      items: updatedDeliveryNote.items,
      updatedAt: new Date().toISOString(),
    });
    return { id, ...updatedDeliveryNote };
  }

  static async delete(id) {
    const docRef = deliveryNotesCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error("Delivery note not found.");
    }
    await docRef.delete();
    return;
  }
}

export default DeliveryNote;
