import axios, { AxiosResponse } from "axios";
import store from "../store";

interface getUsernameResponse {
  displayName: string;
}

export const getDisplayName = async () => {
  const res: AxiosResponse<getUsernameResponse> = await axios.post(
    `${process.env.REST_API_URL}/users/whoami`,
    {
      token: store.get("user.accessToken"),
    }
  );
  return res.data.displayName;
};
