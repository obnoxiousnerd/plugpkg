import axios, { AxiosResponse } from "axios";
import { firebaseCreds } from ".";
import { error } from "../color-logs";

interface signInWithEmailAndPasswordResponse {
  /**A Firebase Auth ID token for the authenticated user. */
  idToken: string;
  /**The email for the authenticated user.*/
  email: string;
  /**A Firebase Auth refresh token for the authenticated user.*/
  refreshToken: string;
  /**The number of seconds in which the ID token expires.*/
  expiresIn: string;
  /**The uid of the authenticated user.*/
  localId: string;
  /**Whether the email is for an existing account.*/
  registered: boolean;
}
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const res: AxiosResponse<signInWithEmailAndPasswordResponse> = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseCreds.firebaseAPIKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
    const data = {
      idToken: res.data.idToken,
      refreshToken: res.data.refreshToken,
      email: res.data.email,
      uid: res.data.localId,
      signedIn: Math.floor(Date.now() / 1000),
    };
    return data;
  } catch (e) {
    error(e);
    return {
      idToken: "",
      refreshToken: "",
      email: "",
      uid: "",
      signedIn: Math.floor(Date.now() / 1000),
    };
  }
};

interface signInWithCustomTokenResponse {
  /**A Firebase Auth ID token for the authenticated user. */
  idToken: string;
  /**A Firebase Auth refresh token for the authenticated user.*/
  refreshToken: string;
  /**The number of seconds in which the ID token expires.*/
  expiresIn: string;
}
export const signInWithCustomToken = async (token: string) => {
  try {
    const res: AxiosResponse<signInWithCustomTokenResponse> = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseCreds.firebaseAPIKey}`,
      {
        token: token,
        returnSecureToken: true,
      }
    );
    const data = {
      idToken: res.data.idToken,
      refreshToken: res.data.refreshToken,
      signedIn: Math.floor(Date.now() / 1000),
    };
    return data;
  } catch (e) {
    error(e);
    return {
      idToken: "",
      refreshToken: "",
      signedIn: 0,
    };
  }
};

interface exchangeAccessTokenforIdTokenResponse {
  token: string;
}
export const exchangeAccessTokenforIdToken = async (accessToken: string) => {
  const res: AxiosResponse<exchangeAccessTokenforIdTokenResponse> = await axios.post(
    `${process.env.REST_API_URL}/tokens/verify`,
    {
      token: accessToken,
    }
  );
  return res.data.token;
};

interface renewIdTokenResponse {
  /**The granted access token. */
  access_token: string;
  /**Expiration time of `access_token` in seconds. */
  expires_in: string;
  /**The type of `access_token`. Included to conform with the OAuth 2.0 specification; always `Bearer`. */
  token_type: string;
  /**The granted refresh token; might be the same as `refresh_token` in the request. */
  refresh_token: string;
}
export const renewIdToken = async (refreshToken: string) => {
  const res: AxiosResponse<renewIdTokenResponse> = await axios.post(
    `https://securetoken.googleapis.com/v1/token?key=${firebaseCreds.firebaseAPIKey}`,
    `grant_type=refresh_token&refresh_token=${refreshToken}`
  );
  const toReturn = {
    idToken: res.data.access_token,
    refreshToken: res.data.refresh_token,
  };
  if (refreshToken === toReturn.refreshToken) delete toReturn.refreshToken;
  return toReturn;
};

export const retrieveAccessToken = async (uid: string) => {
  const res: AxiosResponse<{ token: string }> = await axios.get(
    `${process.env.REST_API_URL}/tokens/${uid}`
  );
  return res.data.token;
};

export const sendEmailLink = async (email: string) => {
  const sendEmailRes: AxiosResponse = await axios.post(
    `${process.env.REST_API_URL}/auth/sendLink`,
    { email }
  );
  if (sendEmailRes && sendEmailRes.data.message === "OK") {
    return true;
  } else {
    error("Something went wrong!! Please try again");
    return false;
  }
};

export const getEmailLinkCode = async (
  email: string
): Promise<boolean | string> => {
  try {
    const res = await axios.post(
      `${process.env.REST_API_URL}/auth/getOobCode`,
      {
        email,
      }
    );
    if (res && res.data.code === "auth/not-verified-yet") {
      return false;
    } else if (res && res.data.oobCode) {
      return res.data.oobCode;
    } else return false;
  } catch (e) {
    error(e.response.data || null);
    error(e.message || e);
    return false;
  }
};

interface signInWithEmailLinkCodeResponse {
  email: string;
  expiresIn: string;
  idToken: string;
  isNewUser: boolean;
  kind: "identitytoolkit#EmailLinkSigninResponse";
  localId: string;
  refreshToken: string;
}

export const signInWithEmailLinkCode = async (
  email: string,
  oobCode: string
) => {
  try {
    const res: AxiosResponse<signInWithEmailLinkCodeResponse> = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/emailLinkSignin?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        oobCode,
      }
    );
    if (res.data.isNewUser) {
      error("You must sign in using the web app before using the CLI.");
      return null;
    } else if (res.data.email !== email) {
      error(
        "You were about to sign in accidently into another user's account. Please try again"
      );
    } else {
      return {
        uid: res.data.localId,
        idToken: res.data.idToken,
        refreshToken: res.data.refreshToken,
        signedIn: Math.floor(Date.now() / 1000),
      };
    }
  } catch (e) {
    error(e.message || e);
  }
};
