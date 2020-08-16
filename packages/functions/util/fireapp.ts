import * as admin from "firebase-admin";
const fireApp = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.GCLOUD_CREDENTIALS, "base64").toString("utf8")
    )
  ),
});
export const db = fireApp.firestore();
export const bucket = fireApp.storage().bucket(process.env.STORAGE_BUCKET);
export const auth = fireApp.auth();
