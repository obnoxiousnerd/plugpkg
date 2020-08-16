import { auth } from "../fireapp";
import { NowResponse, NowRequest } from "@vercel/node";
export const isAuthenticated = async (req: NowRequest, res: NowResponse) => {
  try {
    const { authorization } = req.headers;
    // No auth header present
    if (!authorization)
      return res.status(401).send({ message: "Unauthorized" });
    // Auth does not start with bearer
    if (!authorization?.startsWith("Bearer"))
      return res.status(401).send({ message: "Unauthorized" });
    const bearerSplit = authorization?.split("Bearer ") as string[];
    // Bearer token is not present
    if (bearerSplit?.length !== 2)
      return res.status(401).send({ message: "Unauthorized" });
    const token = bearerSplit[1];
    // Verify token
    try {
      await auth.verifyIdToken(token);
      return true;
    } catch (err) {
      console.error(`${err.code} -  ${err.message}`);
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (e) {
    console.error(e);
    if (!res.headersSent)
      return res.status(401).send({ message: "Unauthorized" });
  }
};
