import { NowRequest, NowResponse } from "@vercel/node";
import allowCors from "../util/allowCors";
import axios from "axios";
import URLPattern = require("url-pattern");
import fs = require("fs");
import path = require("path");

/**
 * Email-oobCode pairs are stored here for verification.
 */
// This is possible because AWS reuses the instance till it is warm
// and to keep it warm the CLI pings the function every 1s
// However, if the function becomes cold (approx 15-30mins inactivity)
// Everything stored here is lost.

const oobCodes: { [email: string]: string } = {};
const emailLinkSigninView = fs.readFileSync(
  path.join(__dirname, "..", "views/email-link-signin/index.html"),
  "utf8"
);

const handler = async (req: NowRequest, res: NowResponse) => {
  const continueURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/auth/verify"
      : `${process.env.REST_API_URL}/auth/verify`;
  const url = req.url;
  const routes = {
    "/sendLink": new URLPattern("/auth/sendLink"),
    "/verify": new URLPattern("/auth/verify(*)"),
    "/getOobCode": new URLPattern("/auth/getOobCode"),
  };
  if (routes["/sendLink"].match(url) && req.method === "POST") {
    const email = req.body.email;
    const sendEmailRes = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${process.env.GOOGLEAPIS_KEY}`,
      {
        requestType: "EMAIL_SIGNIN",
        email: email,
        continueUrl: `${continueURL}?em=${Buffer.from(email).toString(
          "base64"
        )}`,
      }
    );
    oobCodes[email] = "";
    if (sendEmailRes) res.status(200).send({ message: "OK" });
    else res.status(500).send({ message: "Internal Server Error" });
  } else if (routes["/verify"].match(url) && req.method === "GET") {
    const params = new URLSearchParams(`?${req.url.split("?")[1]}`);
    const oobCode = params.get("oobCode");
    const email = Buffer.from(params.get("em"), "base64").toString("utf8");
    oobCodes[email] = oobCode;
    console.log(oobCodes);
    // const verifyCodeRes = await axios.post(
    //   `https://www.googleapis.com/identitytoolkit/v3/relyingparty/emailLinkSignin?key=${process.env.GOOGLEAPIS_KEY}`,
    //   { oobCode: oobCode, email: email }
    // );
    res.send(emailLinkSigninView);
  } else if (routes["/getOobCode"].match(url) && req.method === "POST") {
    const email = req.body.email;
    const oobCode = oobCodes[email];
    console.log(oobCodes);
    if (oobCode !== "") {
      res.status(200).send({ oobCode: oobCode });
    } else {
      res.status(200).send({
        message: "No response from email",
        code: "auth/not-verified-yet",
      });
    }
  } else {
    res.status(404).send("");
  }
};
export default allowCors(handler);
