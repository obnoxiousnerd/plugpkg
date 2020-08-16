import { NowRequest, NowResponse } from "@vercel/node";
import allowCors from "../util/allowCors";
import { createScope } from "../util/users/scopes";
import { isAuthenticated } from "../util/auth/is-auth";
const handler = async (req: NowRequest, res: NowResponse) => {
  const URLPaths = req.url.split("/");
  URLPaths.splice(0, 1);
  console.log(URLPaths);
  if (req.method === "GET" && isAuthenticated(req, res)) {
    createScope(URLPaths[1], req, res);
  }
};
export default allowCors(handler);
