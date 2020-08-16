import { v4 } from "uuid";
import { db, auth } from "../fireapp";
import { Request, Response } from "express";
import { NowRequest, NowResponse } from "@vercel/node";

/**
 * Retrieve the access token for the user, if authenticated.
 */
export const getAccessToken = async (uid: string) => {
  const docQuery = db.collection("tokens").where("uid", "==", uid);
  const docs = await docQuery.get();
  if (!docs.docs[0]) return "404";
  const authToken = docs.docs[0].id;
  return authToken;
};
/**
 * Retrieve the access token for the user, if authenticated.
 * **Intended to be used as a handler for the REST API.**
 */
export const getAccessTokenAPI = async (uid: string, res: NowResponse) => {
  try {
    const authToken = await getAccessToken(uid);
    if (!authToken || authToken === "404") {
      res.status(404).send({ message: "Not Found" });
    }
    if (!res.headersSent) res.status(200).send({ token: authToken });
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(500).send("");
  }
};

/**
 * Creates an access token for the user, if authenticated.
 */
export const createCustomToken = async (uid: string) => {
  const randomToken = v4();
  await db.doc(`tokens/${randomToken}`).set({ uid: uid });
  return randomToken;
};
/**
 * Creates an access token for the user, if authenticated.
 * **Intended to be used as a handler for the REST API.**
 */
export const createAccessTokenAPI = async (uid: string, res: NowResponse) => {
  const randomToken = await createCustomToken(uid);
  res.status(201).send({ token: randomToken });
};

interface AccessTokenVerificationData {
  token: string;
}

/**
 * Mint a JWT from Firebase Admin and send it.
 */
export const verifyAccessTokenAndGetLoginToken = async (
  req: NowRequest,
  res: NowResponse
) => {
  try {
    const data: AccessTokenVerificationData = req.body;
    if (!data) res.status(400).send({ message: " Access Token missing" });
    const tokenDoc = (await (
      await db.doc(`tokens/${data.token}`).get()
    ).data()) as { uid: string };
    const customToken = await auth.createCustomToken(tokenDoc.uid);
    res.status(200).send({ token: customToken });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message || e });
  }
};
export const verifyAccessTokenAndGetLoginTokenAPI = async (
  req: Request,
  res: Response
) => {
  try {
    const data: AccessTokenVerificationData = req.body;
    if (!data) res.status(400).send({ message: " Access Token missing" });
    const tokenDoc = (await (
      await db.doc(`tokens/${data.token}`).get()
    ).data()) as { uid: string };
    const customToken = await auth.createCustomToken(tokenDoc.uid);
    res.status(200).send({ token: customToken });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message || e });
  }
};
