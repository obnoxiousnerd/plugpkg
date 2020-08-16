import conf, { Schema } from "conf";
interface StoreSchema {
  user: {
    idToken: string;
    refreshToken: string;
    signedIn: string;
    accessToken: string;
  };
}
const schema: Schema<StoreSchema> = {
  user: {
    type: "object",
    default: {},
    properties: {
      accessToken: {
        type: "string",
        default: "",
      },
      idToken: {
        type: "string",
        default: "",
      },
      refreshToken: {
        type: "string",
        default: "",
      },
      signedIn: {
        type: "number",
        default: 0,
      },
    },
  },
};
const store = new conf({
  schema: schema,
  configName: "plugpkg",
  accessPropertiesByDotNotation: true,
});
export default store;
