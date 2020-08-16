import { NowRequest, NowResponse } from "@vercel/node";
import allowCors from "../util/allowCors";
const handler = async (req: NowRequest, res: NowResponse) => {
  res
    .status(404)
    .send("<h1>You just hit a route that does not exist; the sadness :(</h1>");
};
export default allowCors(handler);
