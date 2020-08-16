import { NowRequest, NowResponse } from "@vercel/node";
import {
  verifyAccessTokenAndGetLoginToken,
  getAccessTokenAPI,
  createAccessTokenAPI,
} from "../util/auth/access-token";
import { isAuthenticated } from "../util/auth/is-auth";
import allowCors from "../util/allowCors";
const handler = async (req: NowRequest, res: NowResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const URLEndPath = req.url.split("/").pop();
  if (URLEndPath === "verify" && req.method === "POST")
    verifyAccessTokenAndGetLoginToken(req, res);
  else {
    if (req.method === "GET" && isAuthenticated(req, res)) {
      getAccessTokenAPI(URLEndPath, res);
    }
    if (req.method === "POST" && isAuthenticated(req, res)) {
      createAccessTokenAPI(URLEndPath, res);
    }
  }
};
export default allowCors(handler);
