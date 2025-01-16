import { getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  DEFAULT_PROFILE_IMAGE,
  USER_COLLECTION,
} from "../utils/commonConstant.js";

class User {
  constructor(name, email, password, profilePicture, userRole, id, createdAt) {
    this.id = id || null;
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
    this.userRole = userRole || "user";
    this.createdAt = createdAt || Timestamp.now();
  }

  /**
   * Save a new user in Firestore.
   * @returns void
   */
  async save() {
    const db = getFirestore();

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      profilePicture: this.profilePicture,
      userRole: this.userRole,
      createdAt: this.createdAt,
    };

    const docRef = db.collection(USER_COLLECTION).doc();
    await docRef.set(userData);
  }

  /**
   * Retrieve a user from Firestore by Email.
   * @param {string} email - User email
   * @returns {User} - User object or null if not found
   */
  static async findByEmail(email) {
    const db = getFirestore();

    const userDoc = await db
      .collection(USER_COLLECTION)
      .where("email", "==", email)
      .get();

    let user;

    userDoc.forEach((doc) => {
      const data = doc.data();
      user = new User(
        data.name,
        data.email,
        data.password,
        data.profilePicture,
        data.userRole,
        doc.id,
        data.createdAt
      );
    });

    return user;
  }

  /**
   * Get all users from the `users` collection.
   * @returns {User[]} - Array of User objects
   */
  static async findAll(sortDirection,startIndex,limit) {
    const db = getFirestore();
    const snapshot = await db
      .collection(USER_COLLECTION)
      .orderBy("createdAt", sortDirection) 
      .offset(startIndex) 
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new User(
        data.name,
        data.email,
        data.password,
        data.profilePicture,
        data.userRole,
        doc.id,
        data.createdAt
      );
    });
  }

  static async updateById(id, userData) {
    const db = getFirestore();

    const userDoc = await db.collection(USER_COLLECTION).doc(id);

    if (userDoc.empty) {
      console.error("User not found in the database.", userData.email);
      return;
    }

    const res = await userDoc.update(this.createUpdateUserObject(userData));
    return res;
  }

  static createUpdateUserObject(user) {
    const allowedFields = ["name", "email", "password", "profilePicture"];
    let updateUserObject = {};

    Object.keys(user).forEach((key) => {
      if (allowedFields.includes(key) && user[key] && user[key].trim() !== "") {
        updateUserObject[key] = user[key];
      }
    });
    return updateUserObject;
  }

  static async findByIdAndDelete(id) {
    return await db.collection(USER_COLLECTION).doc(id).delete();
  }
}

export default User;
