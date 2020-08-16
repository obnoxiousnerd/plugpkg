import { db, auth } from "../fireapp";
import { NowResponse } from "@vercel/node";
export const tellWhoAmI = async (token: string, res: NowResponse) => {
  try {
    if (!token) return res.status(400).send({ message: "No token" });
    const uidDoc = await db.doc(`tokens/${token}`).get();
    const { uid } = uidDoc.data() as { uid: string };
    const user = await auth.getUser(uid);
    res.send({ displayName: user.displayName });
  } catch (e) {
    console.error(e);
    res.status(401).send({ message: "Unauthorized" });
  }
};
