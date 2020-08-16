import { NowRequest, NowResponse } from "@vercel/node";
import allowCors, { middleware } from "../util/allowCors";
import Router = require("router");
const router = Router();
router.use(middleware);
router.get("/", (req: NowRequest, res: NowResponse) => {
  res.send({ msg: "Hello there" });
});
export default (req: NowRequest, res: NowResponse) => {
  router(req, res, () => {
    res.status(404).send({ message: "Not Found" });
  });
};
