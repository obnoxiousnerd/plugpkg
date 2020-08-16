import { NowResponse } from "@vercel/node";
import { db } from "../fireapp";
export const name2UID = async (names: string[], res: NowResponse) => {
  const query = db.collection("users");
  for (const name in names) {
    query.where("displayName", "==", name);
  }
  const { docs } = await query.get();
  const toSend = [];
  if (docs)
    docs.forEach((doc) => {
      const data = doc.data();
      toSend.push({ name: data.displayName, uid: data.uid });
    });
  res.send(toSend);
};
export const UID2name = async (uids: string[], res: NowResponse) => {
  const queries = [];
  uids.forEach((uid) => {
    queries.push(db.doc(`users/${uid}`));
  });
  const docs = await db.getAll(...queries);
  const toSend = {};
  if (docs)
    docs.forEach((doc) => {
      if (!doc.exists) return (toSend[doc.id] = "_NOT_FOUND_");
      const data = doc.data();
      toSend[doc.id] = data.displayName;
    });
  res.send(toSend);
};
