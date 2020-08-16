import { db } from "../fireapp";
import { NowRequest, NowResponse } from "@vercel/node";
/**
 * Create a scope for a particular user.
 * Example Request
 * GET /api/scopes/foobar, body : {uid: the-users-uid, writeAccessUID: [uid-1, uid-2]}
 * RESPONSE: 201 (Created)
 */
export const createScope = (
  scopeName: string,
  req: NowRequest,
  res: NowResponse
) => {
  const ownerOfScope = req.body.uid;
  const writeAccessUsers = req.body.writeAccessUID;
  db.doc(`scopes/${scopeName}`).set({
    owner: ownerOfScope,
    writeAccess: [ownerOfScope, ...writeAccessUsers],
  });
  res.status(201).send("");
};

interface ScopeResponseObject {
  scopes: ScopeItem[];
}
interface ScopeItem {
  name: string;
  role: "owner" | "can-write";
}

export const searchUserScopes = async (uid: string, res: NowResponse) => {
  try {
    const scopeDocs = await db
      .collection("scopes")
      .where("owner", "==", uid)
      .get();
    const scopeWriteAccessDocs = await db
      .collection("scopes")
      .where("writeAccess", "array-contains", uid)
      .get();
    const responseObject: ScopeResponseObject = { scopes: [] };
    const scopeEntryAlreadyExists = (obj: ScopeItem, scopeName: string) => {
      return obj.name === scopeName;
    };
    if (scopeDocs.empty && scopeWriteAccessDocs.empty)
      return res.send({ message: "User is not registered in any scope" });
    scopeDocs.docs.forEach((doc) => {
      responseObject.scopes.push({ name: doc.id, role: "owner" });
    });
    scopeWriteAccessDocs.docs.forEach((doc) => {
      const alreadyExists = scopeWriteAccessDocs.docs.some((docs) => {
        const data = docs.data() as ScopeItem;
        scopeEntryAlreadyExists(data, doc.id);
      });
      if (!alreadyExists)
        responseObject.scopes.push({ name: doc.id, role: "can-write" });
    });
    res.send(responseObject);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(500).send("");
  }
};
