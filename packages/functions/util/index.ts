import * as express from "express";
import * as bodyParser from "body-parser";
import { setRoutes } from "./routes";

const app = express();
app.use(bodyParser.json());
app.use("*", (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).send();
  } else {
    next();
  }
});
app.all("*", (req, res) => {
  res.send("Hello there!!!");
});
setRoutes(app);
// app.use(
//   (
//     err: NodeJS.ErrnoException,
//     req: express.Request,
//     res: express.Response,
//     next: Function
//   ) => {
//     console.error(err.stack);
//     // if (err.name === "blocked-by-cors")
//     //   res
//     //     .status(401)
//     //     .send({ message: "Your request has been blocked by CORS" });
//   }
// );
export { app };
