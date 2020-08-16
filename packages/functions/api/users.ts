import { NowRequest, NowResponse } from "@vercel/node";
import allowCors from "../util/allowCors";
import { isAuthenticated } from "../util/auth/is-auth";
import { tellWhoAmI } from "../util/auth/whoami";
import { searchUserScopes } from "../util/users/scopes";
import { UID2name } from "../util/users/name-uid";
const handler = async (req: NowRequest, res: NowResponse) => {
  const URLPaths = req.url.split("/");
  URLPaths.splice(0, 1);
  if (
    URLPaths[1] === "whoami" &&
    req.method === "POST" &&
    isAuthenticated(req, res)
  ) {
    return tellWhoAmI(req.body.token, res);
  } else if (
    URLPaths[1] === "scopes" &&
    req.method === "GET" &&
    isAuthenticated(req, res)
  ) {
    return searchUserScopes(URLPaths[2], res);
  } else if (
    URLPaths[1] === "name2uid" &&
    req.method === "POST" &&
    isAuthenticated(req, res)
  ) {
  } else if (
    URLPaths[1] === "uid2name" &&
    req.method === "POST"
    // isAuthenticated(req, res)
  ) {
    return UID2name(req.body.uids, res);
  }
};
export default allowCors(handler);
