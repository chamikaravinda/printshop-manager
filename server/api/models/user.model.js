import { Timestamp } from "firebase-admin/firestore";
import { firestore } from "../config/firebase.config.js";
import { USER_COLLECTION, USER_ROLE_USER } from "../utils/commonConstant.js";

const userCollection = firestore.collection(USER_COLLECTION);

class User {
  constructor(name, email, password, profilePicture, userRole, id, createdAt) {
    this.id = id || null;
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
    this.userRole = userRole || USER_ROLE_USER;
    this.createdAt = createdAt || Timestamp.now();
  }

  /**
   * Save a new user in Firestore.
   * @returns void
   */
  async save() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      profilePicture: this.profilePicture,
      userRole: this.userRole,
      createdAt: this.createdAt,
    };

    await userCollection.add(userData);
  }

  /**
   * Retrieve a user from Firestore by Email.
   * @param {string} email - User email
   * @returns {User} - User object or null if not found
   */
  static async findByEmail(email) {
    const userDoc = await userCollection.where("email", "==", email).get();

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
  static async findAll(sortDirection, startIndex, limit) {
    const snapshot = await userCollection
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
    const userDoc = await userCollection.doc(id);

    if (userDoc.empty) {
      console.error("User not found in the database.", userData.email);
      return;
    }

    const res = await userDoc.update(this.createUpdateUserObject(userData));
    return res;
  }

  static async findByIdAndDelete(id) {
    return await userCollection.doc(id).delete();
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
}

export default User;
