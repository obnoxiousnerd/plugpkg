import debug from "debug";
export const auth = debug("auth"),
  login = auth.extend("login"),
  logout = auth.extend("logout"),
  signinEP = auth.extend("signinEmailPass"),
  signInToken = auth.extend("signInAccessToken");
