import admin from "firebase-admin";
import serviceAccount from "../../dulangi-enterprises-firebase-adminsdk-fbsvc-fa12c6bf41.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firestore = admin.firestore();
